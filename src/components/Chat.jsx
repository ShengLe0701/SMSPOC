import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import MessageForm from 'components/MessageForm';
import MessageList from 'components/MessageList';
import Name from 'components/Name';
import { ChatType } from 'constants';

function Chat(props) {
  if (props.contact) {
    return (
      <div className="Chat">
        <div className="Chat-header">
          <h2 className="m-0">
            <Name contact={props.contact} />
          </h2>
        </div>
        <div className="Chat-body">
          <MessageList messages={props.messages} />
        </div>
        {props.contact.get('isUnsubscribed') ? (
          <div className="Chat-error">
            The guest decided to unsubscribe.
          </div>
        ) : ''}
        {props.contact.get('isDeliveryError') ? (
          <div className="Chat-error">
            Unable to deliver SMS. Please check guest's phone number.
          </div>
        ) : ''}
        <div className="Chat-footer">
          <MessageForm
            chatType={props.chatType}
            chatId={props.chatId}
            disabled={props.contact.get('isUnsubscribed')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="ChatPlaceholder">
      Please select a guest
    </div>
  );
}

Chat.propTypes = {
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
  () => ({})
)(Chat);
