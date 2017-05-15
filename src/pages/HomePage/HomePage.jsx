import React from 'react';
import { connect } from 'react-redux';

import * as actions from 'actions';
import $ from 'jquery';

function clearFields() {
  $.find('input[name="email"]')[0].value = '';
  $.find('input[name="fullname"]')[0].value = '';
}

function validEmail(email) {
  return (email.length > 0);
}

function validName(name) {
  return (name.length > 0);
}

function validFields(args) {
  return validEmail(args.email) && validName(args.name);
}

function handleSubmit(props, data) {
  if (validFields(data)) {
    props.onSubmit(data);
  }
}

function HomePage(props) {
  return (
    <div className="HomePage">
      <div className="HomePage-nav py-3">
        <div className="container text-right">
          <a href="/app">Login</a>
        </div>
      </div>
      <div className="HomePage-fold">
        <div className="HomePage-hero">
          <div className="container">
            <div className="HomePage-hero-logo">
              <img
                className="img-fluid"
                src="/svg/logo.svg"
                alt="stay delightful"
              />
            </div>
            <p className="HomePage-hero-subheading">
              Enabling hoteliers to delight their guests.
            </p>
            <div className="HomePage-hero-tagline">
              <i className="fa fa-lg fa-fw fa-star" />{' '}Receive glowing reviews
            </div>
            <div className="HomePage-hero-tagline">
              <i className="fa fa-lg fa-fw fa-hotel" />{' '}Obtain more bookings
            </div>
            <div className="HomePage-hero-tagline">
              <i className="fa fa-lg fa-fw fa-dollar" />{' '}Increase your revenue
            </div>
          </div>
        </div>
        <div className="HomePage-form">
          <div className="container">
            <p className="HomePage-form-heading HomePage-lead">
              Sign up to delight your guests
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const element = $(e.target);
                const email = element.find('input[name="email"]')[0].value;
                const name = element.find('input[name="fullname"]')[0].value;
                handleSubmit(props, { email, name });
                clearFields();
              }}
            >
              <div className="HomePage-form-container">
                <input
                  type="text"
                  placeholder="Full name"
                  className="HomePage-form-input"
                  name="fullname"
                />
                <input
                  type="text"
                  placeholder="Email address"
                  className="HomePage-form-input"
                  name="email"
                />
                <button type="submit" className="btn btn-primary">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="HomePage-intro">
        <div className="container">
          <h2>
            Delight your guests with on-demand communication fit for the mobile first traveler.
          </h2>
          <div className="row mt-5">
            <div className="col-md-6">
              <div className="HomePage-intro-img p-5 d-flex flex-column justify-content-end">
                <img src="/svg/interact.svg" className="img-fluid" alt="interact" />
              </div>
              <p className="lead">
                <span className="text-primary font-weight-bold">
                  Interact with guests where the guests prefer to communicate
                </span> – text, email, or existing popular chat apps – from a single web dashboard.
              </p>
            </div>
            <div className="col-md-6">
              <div className="HomePage-intro-img p-5 d-flex flex-column justify-content-end">
                <img src="/svg/communicate.svg" className="img-fluid" alt="communicate" />
              </div>
              <p className="lead">
                <span className="text-primary font-weight-bold">
                  Easily communicate across departments to improve operational efficiency.
                </span> We help hotels get rid of pen and paper and radio,
                and record everything to gain visibility into what is happening on property.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="HomePage-value">
        <div className="container HomePage-lead">
          Delighted guests leave great reviews, which increase loyalty and repeat bookings.
        </div>
      </div>
      <div className="HomePage-about">
        <div className="container">
          <div className="HomePage-about-devices">
            <div className="HomePage-about-desktop">
              <img src="/svg/desktop.svg" className="img-fluid" alt="desktop" />
            </div>
            <div className="HomePage-about-phone">
              <img src="/svg/phone.svg" className="img-fluid" alt="phone" />
            </div>
          </div>
          <h2>
            Stay Delightful is not just a messaging platform.
            We help you improve your operation with each interaction.
          </h2>
          <div className="HomePage-about-feature row">
            <div className="col-md-4 p-5">
              <img src="/svg/extract.svg" className="img-fluid" alt="extract" />
            </div>
            <div className="col-md-8 lead">
              <span className="text-primary font-weight-bold">
                Extract actionable insights from guest interactions
              </span> to recommend relevant offers
              at the perfect moment to delight your guests.
            </div>
          </div>
          <div className="HomePage-about-feature row">
            <div className="col-md-4 p-5">
              <img src="/svg/turn.svg" className="img-fluid" alt="turn" />
            </div>
            <div className="col-md-8 lead">
              <span className="text-primary font-weight-bold">
                Turn conversations into visual data
              </span> using sentiment analysis to understand
              – within seconds – what to focus on to deliver a guest experience
              that results in increased ancillary revenue, great reviews, and more bookings
            </div>
          </div>
        </div>
      </div>
      <div className="HomePage-footer">
        <div className="container text-center">
          © Reality Labs Inc. 2017
        </div>
      </div>
    </div>
  );
}

HomePage.propTypes = {
  onSubmit: React.PropTypes.func,
};

export default connect(
  () => ({}),
  (dispatch) => ({
    onSubmit: (data) => dispatch(actions.sendEmail(data)),
  })
)(HomePage);
