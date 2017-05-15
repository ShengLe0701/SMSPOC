import React from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import { Map } from 'immutable';
import { connect } from 'react-redux';

import s from 'style/sheets';
import color from 'style/color';
import * as actions from 'actions';
import * as nativeActions from 'actions/native';

function compare(c1, c2) {
  const time = c => new Date(c.get('lastMessageAt') || 0);
  return time(c2) - time(c1);
}

function ContactList(props) {
  const contacts = props.contacts
    .filter(props.filter)
    .sort(compare)
    .map(contact => (
      <TouchableHighlight
        onPress={() => props.onSelect(contact.get('id'))}
        underlayColor={color.primaryDarker}
        key={`contact-${contact.get('id')}`}
        style={{
          paddingLeft: 12,
          paddingRight: 12,
          backgroundColor: (
            contact.get('id') === props.selectedId ? color.primary : 'transparent'
          ),
          borderTopRightRadius: 4,
          borderBottomRightRadius: 4,
          justifyContent: 'center',
          height: 32,
        }}
      >
        <Text
          style={[s.b1, s.textInverse, {
            color: contact.get('hasUnreadMessages') ? color.primary : color.white,
          }]}
        >
          {contact.get('isVerified') === false ? 'unverified guest' : contact.get('name')}
        </Text>
      </TouchableHighlight>
    ))
    .toArray();

  return (
    <View>
      {contacts}
    </View>
  );
}

ContactList.propTypes = {
  contacts: React.PropTypes.instanceOf(Map),
  selectedId: React.PropTypes.string,
  onSelect: React.PropTypes.func,
  filter: React.PropTypes.func,
};

export const GuestsList = connect(
  state => ({
    contacts: state.getIn(['guests', 'items']),
    selectedId: state.getIn(['guests', 'selectedId']),
  }),
  dispatch => ({
    onSelect: guestId => {
      dispatch(actions.selectGuest(guestId));
      dispatch(nativeActions.setMenuOpen(false));
    },
    filter: () => true,
  })
)(ContactList);

export const UsersList = connect(
  state => {
    const userId = state.getIn(['auth', 'user', 'id']);
    return {
      contacts: state.getIn(['users', 'items']).delete(userId),
      selectedId: state.getIn(['users', 'selectedId']),
    };
  },
  dispatch => ({
    onSelect: userId => {
      dispatch(actions.selectUser(userId));
      dispatch(nativeActions.setMenuOpen(false));
    },
    filter: user => user.get('isActive'),
  })
)(ContactList);
