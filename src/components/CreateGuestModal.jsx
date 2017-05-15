import React from 'react';
import { connect } from 'react-redux';
import Datetime from 'react-datetime';
import moment from 'moment';
import _ from 'lodash';

import * as actions from 'actions';
import ModalWrapper from 'components/ModalWrapper';

class CreateGuestModal extends React.Component {
  constructor(props) {
    super(props);

    const defaultCheckin = moment()
      .hours(14)
      .startOf('hour');
    const defaultCheckout = moment()
      .add(1, 'd')
      .hours(11)
      .startOf('hour');

    this.state = {
      emailError: false,
      nameError: false,
      phoneError: false,
      checkinAt: defaultCheckin,
      checkoutAt: defaultCheckout,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validEmail() {
    if (this.emailInput.value.length === 0) return true;

    const retVal = /^.+@.+\..+$/.test(this.emailInput.value);
    this.emailErrorMessage = retVal ? '' : 'Email address invalid.';
    this.setState({ emailError: !retVal });

    return retVal;
  }

  validName() {
    const retVal = this.nameInput.value.length > 0;
    this.nameErrorMessage = retVal ? '' : 'Name must be included.';
    this.setState({ nameError: !retVal });

    return retVal;
  }

  validPhone() {
    const retVal = /^\+[\d]{3,100}$/.test(this.phoneInput.value);
    this.phoneErrorMessage = retVal ? '' : 'Phone number invalid.';
    this.setState({ phoneError: !retVal });

    return retVal;
  }

  validFields() {
    const nameBool = this.validName();
    const emailBool = this.validEmail();
    const phoneBool = this.validPhone();

    return nameBool && emailBool && phoneBool;
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.validFields()) {
      return;
    }

    const checkinAt =
      _.isEmpty(this.state.checkinAt) ? '' : this.state.checkinAt.toJSON();
    const checkoutAt =
      _.isEmpty(this.state.checkoutAt) ? '' : this.state.checkoutAt.toJSON();

    this.props.onAddGuest({
      name: this.nameInput.value,
      email: this.emailInput.value,
      phone: this.phoneInput.value,
      room: this.roomInput.value,
      note: this.noteInput.value,
      checkinAt,
      checkoutAt,
    });
  }

  render() {
    return (
      <ModalWrapper
        modalTitle="Add New Guest"
        okText="Add Guest"
        onOk={this.handleSubmit}
      >
        <div className="CreateGuestModal">
          <form onSubmit={this.handleSubmit}>
            <div
              className={`
                form-group
                ${this.state.nameError ? 'has-danger' : ''}
              `}
            >
              <label>Name</label>
              <input
                className="form-control form-control-danger"
                type="text"
                name="name"
                ref={el => { this.nameInput = el; }}
              />
              <span className="form-control-feedback">{this.nameErrorMessage}</span>
            </div>
            <div
              className={`
                form-group
                ${this.state.phoneError ? 'has-danger' : ''}
                ${this.props.guestError.field === 'phone' ? 'has-danger' : ''}
              `}
            >
              <label>Mobile Phone</label>
              <input
                className="form-control form-control-danger"
                type="text"
                name="phone"
                ref={el => { this.phoneInput = el; }}
                placeholder="eg. +17895551212"
              />
              <span className="form-control-feedback">{this.phoneErrorMessage}</span>
              <span className="form-control-feedback">
                {this.props.guestError.message}
              </span>
            </div>
            <div
              className={`
                form-group
                ${this.state.emailError ? 'has-danger' : ''}
              `}
            >
              <label>Email</label>
              <input
                className="form-control form-control-danger"
                type="text"
                name="email"
                ref={el => { this.emailInput = el; }}
              />
              <span className="form-control-feedback">{this.emailErrorMessage}</span>
            </div>
            <div className="form-group">
              <label>Room number</label>
              <input
                className="form-control"
                type="text"
                ref={el => { this.roomInput = el; }}
              />
            </div>
            <div className="form-group">
              <label>Note</label>
              <input
                className="form-control"
                type="text"
                ref={el => { this.noteInput = el; }}
              />
            </div>
            <div className="form-group">
              <label>Checkin Date</label>
              <Datetime
                onChange={checkinAt => this.setState({ checkinAt })}
                value={this.state.checkinAt}
              />
            </div>
            <div className="form-group">
              <label>Checkout Date</label>
              <Datetime
                onChange={checkoutAt => this.setState({ checkoutAt })}
                value={this.state.checkoutAt}
              />
            </div>
          </form>
        </div>
      </ModalWrapper>
    );
  }
}

CreateGuestModal.propTypes = {
  guestError: React.PropTypes.object,
  onAddGuest: React.PropTypes.func,
};

export default connect(
  state => {
    if (_.isEmpty(state.getIn(['guests', 'error'], null))) {
      return {
        guestError: {
          field: '',
          message: '',
        },
      };
    }

    return {
      guestError: state.getIn(['guests', 'error']).toJS(),
    };
  },
  dispatch => ({
    onAddGuest: guest => {
      dispatch(actions.createGuest(guest));
    },
  })
)(CreateGuestModal);
