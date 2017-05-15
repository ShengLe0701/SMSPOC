import React from 'react';
import { Seq } from 'immutable';
import { connect } from 'react-redux';

import * as actions from 'actions';
import * as reactions from 'reactions';
import Name from 'components/Name';

function prevent(actionFn, argument) {
  return event => {
    event.preventDefault();
    actionFn(argument);
  };
}

function ContactList(props) {
  const contacts = props.contacts
    .map(contact => (
      <li
        key={`contact-${contact.get('id')}`}
        className={`
          ContactList-contact
          ${contact.get('id') === props.selectedId ? 'theme-selected' : ''}
          ${contact.get('hasUnreadMessages') ? 'theme-unread' : ''}
        `}
      >
        <a
          className="ContactList-contact-link"
          href="#"
          onClick={prevent(props.onSelect, contact.get('id'))}
        >
          <i
            className={`
              ContactList-contact-icon fa fa
              ${contact.get('hasUnreadMessages') ? 'fa-circle' : 'fa-circle-thin'}
            `}
          />
          <Name contact={contact} />
        </a>
      </li>
    ))
    .toArray();

  return (
    <ul className="ContactList">
      {contacts}
    </ul>
  );
}

ContactList.propTypes = {
  contacts: React.PropTypes.instanceOf(Seq),
  selectedId: React.PropTypes.string,
  onSelect: React.PropTypes.func,
};

export const GuestsList = connect(
  state => ({
    contacts: reactions.displayableGuests(state),
    selectedId: state.getIn(['guests', 'selectedId']),
  }),
  dispatch => ({
    onSelect: guestId => dispatch(actions.selectGuest(guestId)),
  })
)(ContactList);

export const UsersList = connect(
  state => ({
    contacts: reactions.displayableUsers(state),
    selectedId: state.getIn(['users', 'selectedId']),
  }),
  dispatch => ({
    onSelect: userId => dispatch(actions.selectUser(userId)),
  })
)(ContactList);
