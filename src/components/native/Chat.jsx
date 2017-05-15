import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import * as actions from 'actions/native';
import Container from 'components/native/Container';
import MenuButton from 'components/native/MenuButton';
import MessageForm from 'components/native/MessageForm';
import MessageList from 'components/native/MessageList';
import s from 'style/sheets';
import color from 'style/color';
import { ChatType } from 'constants.js';

function Chat(props) {
  let view;

  if (props.contact) {
    view = (
      <View style={{ flex: 1 }}>
        <MessageList messages={props.messages} />
        {
          props.contact ? (
            <MessageForm
              chatType={props.chatType}
              chatId={props.chatId}
              disabled={props.contact.get('isUnsubscribed')}
            />
          ) : <View />
        }
      </View>
    );
  } else {
    view = (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: color.white,
        }}
      >
        <Text style={[s.b1]}>
          Please select a contact
        </Text>
      </View>
    );
  }

  return (
    <Container>
      <View
        style={{
          height: 40,
          justifyContent: 'center',
          borderBottomWidth: 0.5,
          borderColor: color.white,
        }}
      >
        <MenuButton onPress={props.openMenu} />
        <Text
          style={[s.h4, s.textInverse, s.textCenter, {
            marginBottom: 0,
          }]}
        >
          {!props.contact ? 'StayDelightful' : (props.contact.get('name') || 'unverified guest')}
        </Text>
      </View>
      {view}
    </Container>
  );
}

Chat.propTypes = {
  openMenu: React.PropTypes.func,
  chatType: React.PropTypes.string,
  chatId: React.PropTypes.string,
  contact: React.PropTypes.instanceOf(Map),
  messages: React.PropTypes.instanceOf(Map),
};

export default connect(
  state => {
    if (state.getIn(['guests', 'selectedId'])) {
      const chatType = ChatType.GUEST;
      const chatId = state.getIn(['guests', 'selectedId']);
      return {
        chatType,
        chatId,
        contact: state.getIn(['guests', 'items', chatId]),
        messages: state.getIn(['messages', chatType, chatId]),
      };
    } else if (state.getIn(['users', 'selectedId'])) {
      const chatType = ChatType.USER;
      const chatId = state.getIn(['users', 'selectedId']);
      return {
        chatType,
        chatId,
        contact: state.getIn(['users', 'items', chatId]),
        messages: state.getIn(['messages', chatType, chatId]),
      };
    }

    return {};
  },
  dispatch => ({
    openMenu: () => dispatch(actions.setMenuOpen(true)),
  })
)(Chat);
