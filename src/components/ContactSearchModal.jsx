import React from 'react';
import { connect } from 'react-redux';
import { Iterable } from 'immutable';

import * as actions from 'actions';
import { ChatType } from 'constants.js';
import ModalWrapper from 'components/ModalWrapper';
import Name from 'components/Name';

function Results(props) {
  const resultsView = props.results
    .map(contact => (
      <a
        href="#"
        className="list-group-item list-group-item-action flex-column align-items-start"
        key={`result-${contact.get('id')}`}
        onClick={e => {
          e.preventDefault();
          props.selectContact(contact.get('id'));
        }}
      >
        <h6 className="mb-0">
          <Name contact={contact} />
        </h6>
        <small>{contact.get('phone')} {contact.get('email')}</small>
      </a>
    ))
    .toJS();

  return (
    <div className="ContactSearchModal-results">
      <div className="list-group">
        {resultsView}
      </div>
    </div>
  );
}

Results.propTypes = {
  results: React.PropTypes.instanceOf(Iterable),
  selectContact: React.PropTypes.func,
};

function ContactSearchModal(props) {
  return (
    <ModalWrapper
      showOk={false}
      modalTitle={`Search ${props.chatType === ChatType.GUEST ? 'guests' : 'users'}`}
    >
      <div className="ContactSearchModal">
        <div className="input-group">
          <span className="input-group-addon">
            <i className="fa fa-search" />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Enter name"
            value={props.query}
            onChange={e => props.updateQuery(e.target.value)}
          />
        </div>
        <Results results={props.results} selectContact={props.selectContact} />
      </div>
    </ModalWrapper>
  );
}

ContactSearchModal.propTypes = {
  chatType: React.PropTypes.oneOf([ChatType.USER, ChatType.GUEST]),
  query: React.PropTypes.string,
  results: React.PropTypes.instanceOf(Iterable),
  updateQuery: React.PropTypes.func,
  selectContact: React.PropTypes.func,
};

export default connect(
  (state, props) => ({
    query: state.getIn(['contactSearch', props.chatType, 'query']),
    results: state.getIn(['contactSearch', props.chatType, 'results']),
  }),
  (dispatch, props) => ({
    updateQuery: query => dispatch(actions.updateContactSearchQuery(props.chatType, query)),
    selectContact: id => {
      if (props.chatType === ChatType.GUEST) {
        dispatch(actions.selectGuest(id));
      } else {
        dispatch(actions.selectUser(id));
      }
      dispatch(actions.hideModal());
      dispatch(actions.updateContactSearchQuery(props.ChatType, ''));
    },
  })
)(ContactSearchModal);
