import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import Datetime from 'react-datetime';
import moment from 'moment';
import _ from 'lodash';

import * as actions from 'actions';
import ModalWrapper from 'components/ModalWrapper';

class EditGuestInfoModal extends React.Component {
  constructor(props) {
    super(props);

    const defaultCheckin = props.guest.get('checkinAt')
                         ? moment(props.guest.get('checkinAt'))
                         : moment().hours(14).startOf('hour');
    const defaultCheckout = props.guest.get('checkoutAt')
                          ? moment(props.guest.get('checkoutAt'))
                          : moment().add(1, 'd').hours(11)
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

  handleSubmit(event) {
    event.preventDefault();
    if (!this.validFields()) {
      return;
    }

    const checkinAt =
      _.isEmpty(this.state.checkinAt) ? '' : this.state.checkinAt.toJSON();
    const checkoutAt =
      _.isEmpty(this.state.checkoutAt) ? '' : this.state.checkoutAt.toJSON();

    const guestData = this.props.guest.merge({
      isVerified: true,
      name: this.nameInput.value,
      phone: this.phoneInput.value,
      email: this.emailInput.value,
      room: this.roomInput.value,
      note: this.noteInput.value,
      checkinAt,
      checkoutAt,
    }).toJS();

    this.props.onUpdateGuest(guestData);
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

  render() {
    if (!this.props.guest) {
      return (
        <ModalWrapper
          modalTitle="Edit guest info"
          okText="Close"
        >
          The guest you're trying to update doesn't exist.
        </ModalWrapper>
      );
    }

    return (
      <ModalWrapper
        modalTitle="Edit guest info"
        okText="Submit"
        onOk={this.handleSubmit}
      >
        <form onSubmit={this.handleSubmit}>
          <div
            className={`
              form-group
              ${this.state.nameError ? 'has-danger' : ''}
            `}
          >
            <label className="form-control-label">Name</label>
            <input
              className="form-control"
              type="text"
              defaultValue={this.props.guest.get('name')}
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
            <label className="form-control-label">Mobile Phone</label>
            <input
              className="form-control"
              type="text"
              defaultValue={this.props.guest.get('phone')}
              ref={el => { this.phoneInput = el; }}
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
            <label className="form-control-label">Email</label>
            <input
              className="form-control"
              type="text"
              defaultValue={this.props.guest.get('email')}
              ref={el => { this.emailInput = el; }}
            />
            <span className="form-control-feedback">{this.emailErrorMessage}</span>
          </div>
          <div className="form-group">
            <label className="form-control-label">Room</label>
            <input
              className="form-control"
              type="text"
              defaultValue={this.props.guest.get('room')}
              ref={el => { this.roomInput = el; }}
            />
          </div>
          <div className="form-group">
            <label className="form-control-label">Note</label>
            <input
              className="form-control"
              type="text"
              defaultValue={this.props.guest.get('note')}
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
      </ModalWrapper>
    );
  }
}

EditGuestInfoModal.propTypes = {
  guest: React.PropTypes.instanceOf(Map),
  guestError: React.PropTypes.object,
  onUpdateGuest: React.PropTypes.func,
};

export default connect(
  state => {
    const currentState = {
      guest: state.getIn(['guests', 'items', state.getIn(['guests', 'selectedId'])], null),
    };

    if (_.isEmpty(state.getIn(['guests', 'error'], null))) {
      return _.assign({}, currentState, {
        guestError: {
          field: '',
          message: '',
        },
      });
    }

    return _.assign({}, currentState, {
      guestError: state.getIn(['guests', 'error']).toJS(),
    });
  },
  dispatch => ({
    onUpdateGuest: guest => {
      dispatch(actions.updateGuest(guest));
    },
  })
)(EditGuestInfoModal);
