import React from 'react';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';

import { MessageDirection, SmsKeywords } from 'constants';
import Avatar from 'components/Avatar';
import Tooltip from 'components/Tooltip';

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
        <li
          key={`datestamp-${index}`}
          className="MessageList-datestamp text-muted"
        >
          {curMsgTime.toDateString()}
        </li>
      ));
    }

    prevDate = curDate;

    const isOutbound = message.get('direction') === MessageDirection.TO_GUEST
                    || message.get('senderId') === props.selfUserId;
    const isHighlighted = message.get('senderId') === props.selfUserId;
    const senderName = message.get('senderId') ? (
      props.users.getIn([message.get('senderId'), 'name'])
    ) : (
      props.guests.getIn([message.get('guestId'), 'name'])
    );
    const keyword = message.get('body') ? message.get('body').trim().toUpperCase() : '';
    const isWarning = !isOutbound && SmsKeywords.STOP.has(keyword);
    const isSuccess = !isOutbound && SmsKeywords.START.has(keyword);

    messagesViewArray.push((
      <li
        key={`message-${index}`}
        className={`
            MessageList-message
            ${isOutbound ? 'theme-outbound' : 'theme-inbound'}
            ${isHighlighted ? 'theme-highlighted' : ''}
            ${isWarning ? 'theme-warning' : ''}
            ${isSuccess ? 'theme-success' : ''}
        `}
      >
        <div className="MessageList-message-bubbleGroup">
          <div className="MessageList-message-bubbleGroup-avatar">
            <Tooltip text={senderName || 'unverified guest'} align={isOutbound ? 'right' : 'left'}>
              <Avatar name={senderName} themePrimary={isOutbound} />
            </Tooltip>
          </div>
          <div className="MessageList-message-bubbleGroup-bubble">
            {
              message.get('body') || (
                <a href={message.get('uploadUrl')} target="_blank">
                  {message.get('uploadName')}
                </a>
              )
            }
          </div>
        </div>
        <div className="MessageList-message-timestamp text-muted">
          {curMsgTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </li>
    ));
  });

  return (
    <ul className="MessageList">
      {messagesViewArray}
    </ul>
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
