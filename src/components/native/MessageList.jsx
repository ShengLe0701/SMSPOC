import React from 'react';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';

import MessagesScrollView from 'components/native/MessagesScrollView';
import s from 'style/sheets';
import color from 'style/color';
import { MessageDirection /* , SmsKeywords */ } from 'constants';

function MessageList(props) {
  const messages = props.messages ? props.messages.get('items') : new List();
  let messagesViewArray = [];
  let curDate;
  let prevDate;

  messages.forEach((message, index) => {
    const curMsgTime = new Date(message.get('createdAt'));
    curDate = curMsgTime.toDateString();

    if (prevDate !== curDate) {
      messagesViewArray.push((
        <Text
          key={`datestamp-${index}`}
          style={[s.b2, s.textSecondary, s.textCenter]}
        >
          {curMsgTime.toDateString()}
        </Text>
      ));
    }

    prevDate = curDate;

    const isOutbound = message.get('direction') === MessageDirection.TO_GUEST
                    || message.get('senderId') === props.selfUserId;
    const isHighlighted = isOutbound;
    const senderName = message.get('senderId') ? (
      props.users.getIn([message.get('senderId'), 'name'])
    ) : (
      props.guests.getIn([message.get('guestId'), 'name'])
    );

    messagesViewArray.push((
      <View
        key={`message-${index}`}
      >
        <Text
          style={[s.b2, s.textSecondary, {
            marginLeft: 12,
            marginRight: 12,
            textAlign: isOutbound ? 'right' : 'left',
          }]}
        >
          {senderName || 'unverified guest'}
          {', '}
          {curMsgTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <View
          style={{
            borderRadius: 16,
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor: isHighlighted ? color.primary : color.grayLighter,
            marginLeft: isOutbound ? 24 : 0,
            marginRight: isOutbound ? 0 : 24,
            marginBottom: 12,
            alignSelf: isOutbound ? 'flex-end' : 'flex-start',
          }}
        >
          <Text
            style={{
              color: isHighlighted ? color.white : color.grayDark,
              lineHeight: 16,
            }}
          >
            {message.get('body') || message.get('uploadName')}
          </Text>
        </View>
      </View>
    ));
  });

  return (
    <MessagesScrollView>
      {messagesViewArray}
    </MessagesScrollView>
  );
}

MessageList.propTypes = {
  messages: React.PropTypes.instanceOf(Map),
  users: React.PropTypes.instanceOf(Map),
  guests: React.PropTypes.instanceOf(Map),
  selfUserId: React.PropTypes.string,
};

export default connect(
  state => ({
    selfUserId: state.getIn(['auth', 'user', 'id']),
    users: state.getIn(['users', 'items']),
    guests: state.getIn(['guests', 'items']),
  }),
  () => ({})
)(MessageList);
