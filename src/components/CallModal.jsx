import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import ModalWrapper from 'components/ModalWrapper';
import * as actions from 'actions';

class CallModal extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = {
      from: this.props.account.get('phone'),
      to: this.props.guest.get('phone'),
      userTo: this.phoneInput,
    };

    this.props.onCallGuest(data);
  }

  render() {
    const forwardingPhone = this.props.account.get('forwardingPhone');
    let fwdPhoneInput = '';

    if (!!forwardingPhone) {
      fwdPhoneInput = (
        <div key="forward" className="input-group">
          <span className="input-group-addon">
            <input
              type="radio"
              name="optionsRadios"
              defaultValue={forwardingPhone}
              onChange={e => {
                this.phoneInput = e.target.value;
              }}
            />
          </span>
          <span className="input-group-addon">Forwarding Number</span>
          <input
            type="text"
            className="form-control"
            disabled
            defaultValue={forwardingPhone}
          />
        </div>
      );
    }

    const userPhone = this.props.currentUser.get('phone');
    let userPhoneInput = '';
    if (!!userPhone) {
      userPhoneInput = (
        <div key="user" className="input-group">
          <span className="input-group-addon">
            <input
              type="radio"
              name="optionsRadios"
              defaultValue={userPhone}
              onChange={e => {
                this.phoneInput = e.target.value;
              }}
            />
          </span>
          <span className="input-group-addon">Your Number</span>
          <input
            type="text"
            className="form-control"
            disabled
            defaultValue={userPhone}
          />
        </div>
      );
    }

    const customPhoneInput = (
      <div key="custom" className="input-group">
        <span className="input-group-addon">
          <input type="radio" name="optionsRadios" />
        </span>
        <span className="input-group-addon">Custom Number</span>
        <input
          type="text"
          className="form-control"
          onChange={e => {
            this.phoneInput = e.target.value;
          }}
        />
      </div>
    );

    return (
      <ModalWrapper
        modalTitle="Call Guest"
        okText="Call"
        onOk={this.handleSubmit}
      >
        <form onSubmit={this.handleSubmit}>
          {userPhoneInput}<br />
          {fwdPhoneInput}<br />
          {customPhoneInput}
        </form>
      </ModalWrapper>
    );
  }
}

CallModal.propTypes = {
  onCallGuest: React.PropTypes.func,
  okText: React.PropTypes.string,
  modalTitle: React.PropTypes.string,
  account: React.PropTypes.instanceOf(Map),
  currentUser: React.PropTypes.instanceOf(Map),
  guest: React.PropTypes.instanceOf(Map),
};

export default connect(
  state => ({
    account: state.getIn(['account']),
    currentUser: state.getIn(['users', 'items', state.getIn(['auth', 'user', 'id'])]),
    guest: state.getIn(['guests', 'items', state.getIn(['guests', 'selectedId'])], null),
  }),
  dispatch => ({
    onCallGuest: (guest) => {
      dispatch(actions.callGuest(guest));
    },
  })
)(CallModal);
