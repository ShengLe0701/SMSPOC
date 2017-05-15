import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import moment from 'moment';
import _ from 'lodash';

import * as actions from 'actions';
import { ModalType } from 'constants';

function formatTime(time) {
  return time ? moment(time).format('llll') : 'unspecified';
}

function GuestInfo(props) {
  if (!props.guest) {
    return <div />;
  }

  const content = props.guest.get('isVerified') ? (
    <div className="GuestInfo-container">
      <div className="btn-toolbar mb-3">
        <div className="btn-group mr-2">
          <button className="btn btn-sm btn-secondary" onClick={props.showModal}>
            Edit
          </button>
        </div>
        <div className="btn-group mr-2">
          <button
            className="btn btn-sm btn-secondary"
            onClick={e => {
              e.preventDefault();
              props.onArchiveGuest(props.guest.toJS());
            }}
          >
            {props.guest.get('isArchived') ? 'UnArchive' : 'Archive'}
          </button>
        </div>
        <div className="btn-group mr-2">
          <button
            className="btn btn-sm btn-secondary"
            onClick={e => {
              e.preventDefault();
              props.onScheduleMessage();
            }}
          >
            Schedule<br />Message
          </button>
        </div>
        <div className="btn-group">
          <button
            className="btn btn-sm btn-secondary"
            onClick={e => {
              e.preventDefault();
              props.onCallGuest();
            }}
          >
            Call
          </button>
        </div>
      </div>
      <small>Name:</small>
      <p>{props.guest.get('name')}</p>
      <small>Phone number:</small>
      <p>{props.guest.get('phone')}</p>
      <small>Email:</small>
      <p>{props.guest.get('email')}</p>
      <small>Room number:</small>
      <p>{props.guest.get('room')}</p>
      <small>Note:</small>
      <p>{props.guest.get('note')}</p>
      <small>Checkin Time:</small>
      <p>{formatTime(props.guest.get('checkinAt'))}</p>
      <small>Checkout Time:</small>
      <p>{formatTime(props.guest.get('checkoutAt'))}</p>
    </div>
  ) : (
    <div className="GuestInfo-container">
      <div className="btn-toolbar mb-3">
        <div className="btn-group">
          <button
            className="btn btn-sm btn-secondary"
            onClick={e => {
              e.preventDefault();
              props.onArchiveGuest(props.guest.toJS());
            }}
          >
            {props.guest.get('isArchived') ? 'UnArchive' : 'Archive'}
          </button>
        </div>
      </div>
      <small>Phone number:</small>
      <p>{props.guest.get('phone')}</p>
      <button className="btn btn-primary" onClick={props.showModal}>
        Verify This Guest
      </button>
    </div>
  );

  return (
    <div className="GuestInfo">
      <div className="GuestInfo-header mb-2 d-flex justify-content-between">
        <h4>Guest Info</h4>
      </div>
      {content}
    </div>
  );
}

GuestInfo.propTypes = {
  onArchiveGuest: React.PropTypes.func,
  onCallGuest: React.PropTypes.func,
  onScheduleMessage: React.PropTypes.func,
  showModal: React.PropTypes.func,
  guest: React.PropTypes.instanceOf(Map),
};

export default connect(
  state => ({
    guest: state.getIn(['guests', 'items', state.getIn(['guests', 'selectedId'])], null),
  }),
  dispatch => ({
    onArchiveGuest: (guest) => {
      const data = _.assign({}, guest, { isArchived: !guest.isArchived });
      dispatch(actions.updateGuest(data));
    },
    onCallGuest: () => {
      dispatch(actions.showModal(ModalType.CALL_GUEST));
    },
    onScheduleMessage: () => {
      dispatch(actions.showModal(ModalType.SCHEDULE_MESSAGE));
    },
    showModal: () => {
      dispatch(actions.showModal(ModalType.EDIT_GUEST_INFO));
    },
  })
)(GuestInfo);
