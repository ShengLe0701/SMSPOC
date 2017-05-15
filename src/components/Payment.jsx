import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import moment from 'moment';

import config from 'config';
import * as actions from 'actions/payment';
import Page from 'components/Page';

function Button(props) {
  return (
    <StripeCheckout
      token={props.subscribe}
      stripeKey={config.STRIPE_PUBLISHABLE_KEY}
      name="Stay Delightful"
      description="Monthly subscription"
      image="/images/stripe-logo.png"
      panelLabel="Subscribe"
      email={props.email}
      zipCode
      allowRememberMe={false}
    >
      <button className="btn btn-primary">
        {props.text}
      </button>
    </StripeCheckout>
  );
}

Button.propTypes = {
  email: React.PropTypes.string,
  text: React.PropTypes.string,
  subscribe: React.PropTypes.func,
};

class Payment extends React.Component {
  componentWillMount() {
    // This is a routing component,
    // fetch payment info when entering this route.
    this.props.fetchPayment();
  }

  render() {
    let view;
    if (this.props.payment.get('isFetching')) {
      view = (
        <p className="text-muted">
          <i className="fa fa-dollar fa-2x fa-spin" />
        </p>
      );
    } else if (!this.props.payment.get('stripePlanId')) {
      view = <p>You're on a free trial, no credit card required.</p>;
    } else {
      const plan = (
        <div>
          <h4>Your subscription plan</h4>
          <p>{`$${(this.props.payment.getIn(['plan', 'amount']) / 100).toFixed(2)}/month`}</p>
        </div>
      );

      if (!this.props.payment.get('stripeCustomerId')) {
        view = (
          <div>
            {plan}
            <Button
              subscribe={this.props.subscribe}
              email={this.props.user.get('email')}
              text="Enter Payment and Subscribe"
            />
          </div>
        );
      } else {
        const date = moment(this.props.payment.get('activeUntil')).format('dddd, MMMM Do YYYY');
        const brand = this.props.payment.get('stripeCardBrand');
        const digits = this.props.payment.get('stripeCardDigits');
        view = (
          <div>
            {plan}
            <p>Paid until {date}</p>
            <h4>Payment method</h4>
            <p>{brand} XXXX-XXXX-XXXX-{digits}</p>
            <Button
              subscribe={this.props.subscribe}
              email={this.props.user.get('email')}
              text="Update Payment Details"
            />
          </div>
        );
      }
    }

    let error = '';
    if (this.props.payment.get('error')) {
      error = (
        <div className="alert alert-danger" role="alert">
          <strong>Oh snap!</strong>
          {` ${this.props.payment.get('error').response.body.message}`}
        </div>
      );
    }

    return (
      <Page>
        <h1 className="mb-4">Payment Settings</h1>
        {error}
        {view}
      </Page>
    );
  }
}

Payment.propTypes = {
  user: React.PropTypes.instanceOf(Map),
  payment: React.PropTypes.instanceOf(Map),
  fetchPayment: React.PropTypes.func,
  subscribe: React.PropTypes.func,
};

export default connect(
  (state) => ({
    user: state.getIn(['auth', 'user']),
    payment: state.get('payment'),
  }),
  (dispatch) => ({
    fetchPayment: () => dispatch(actions.fetchPayment()),
    subscribe: (token) => dispatch(actions.subscribe(token)),
  })
)(Payment);
