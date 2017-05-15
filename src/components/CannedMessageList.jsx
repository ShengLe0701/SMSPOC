import React from 'react';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';

import * as actions from 'actions';
import { ModalType, NewCannedMessage } from 'constants';
import Page from 'components/Page';

function CannedMessageList(props) {
  const addNew = (
    <button
      className="btn btn-primary"
      onClick={
        () => props.showCannedMessageModal(ModalType.CREATE_CANNED_MESSAGE, NewCannedMessage)
      }
    >
      Add Message Template
    </button>
  );

  const cannedMessageList = props.cannedMessageList.map(cannedMessage => (
    <div className="card CannedMessageList-item" key={`cannedMessage-${cannedMessage.get('id')}`}>
      <div className="card-block">
        <h4 className="card-title">{cannedMessage.get('title')}</h4>
        <p className="card-text mb-1">
          {cannedMessage.get('message')}
        </p>
        <small className="text-muted">
          Created By: {props.users.getIn([cannedMessage.get('userId'), 'name'])}
        </small>
        <div className="mt-3">
          <a
            href="#"
            className="card-link"
            onClick={e => {
              e.preventDefault();
              props.showCannedMessageModal(ModalType.EDIT_CANNED_MESSAGE, cannedMessage);
            }}
          >
            Edit
          </a>
          <a
            href="#"
            className="card-link text-danger"
            onClick={e => {
              e.preventDefault();
              props.showCannedMessageModal(ModalType.DELETE_CANNED_MESSAGE, cannedMessage);
            }}
          >
            Delete
          </a>
        </div>
      </div>
    </div>
  ));

  return (
    <Page>
      <div className="CannedMessageList">
        <h1 className="mb-4">Message Templates</h1>
        {addNew}
        <div className="CannedMessageList-list">
          {cannedMessageList}
        </div>
      </div>
    </Page>
  );
}

CannedMessageList.propTypes = {
  cannedMessageList: React.PropTypes.instanceOf(List),
  users: React.PropTypes.instanceOf(Map),
  showCannedMessageModal: React.PropTypes.func,
};

export default connect(
  state => ({
    cannedMessageList: state.getIn(['cannedMessages', 'items']),
    users: state.getIn(['users', 'items']),
  }),
  dispatch => ({
    showCannedMessageModal: (modal, cannedMessage) => {
      dispatch(actions.setSelectedCannedMessage(cannedMessage));
      dispatch(actions.showModal(modal));
    },
  })
)(CannedMessageList);
