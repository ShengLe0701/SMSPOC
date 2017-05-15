import React from 'react';
import { connect } from 'react-redux';
import Notification from 'react-web-notification';

import { ChatType, MessageDirection } from 'constants';

class GenericWebNotification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ignoreWebNotification: false,
      webNotificationTitle: '',
      options: {},
    };

    this.handleNotSupported = this.handleNotSupported.bind(this);
    this.handlePermissionGranted = this.handlePermissionGranted.bind(this);
    this.handlePermissionDenied = this.handlePermissionDenied.bind(this);
    this.handleNotificationOnShow = this.handleNotificationOnShow.bind(this);

    this.handleWebNotification = this.handleWebNotification.bind(this);
  }

  componentDidMount() {
    document.getElementById('web-notification').addEventListener('web-event', (event) => {
      this.handleWebNotification(event.detail);
    }, false);
  }

  findContact(action) {
    if (action.chatType === ChatType.USER) {
      return this.props.users[action.chatId];
    }
    return this.props.guests[action.chatId];
  }

  handleWebNotification(action) {
    if (this.state.ignoreWebNotification
        || (action.message.direction === MessageDirection.TO_GUEST)
        || (this.props.selfUserId === action.message.senderId)
        || (this.props.selectedGuestId === action.message.guestId)
        || (action.chatType === ChatType.USER
         && this.props.selectedUserId === action.chatId)) {
      return;
    }

    const title = `New message from ${this.findContact(action).name || 'unverified guest'}`;
    const body = action.message.body;
    const icon = 'https://georgeosddev.github.io/react-web-notification/example/Notifications_button_24.png';

    const options = {
      body,
      icon,
      lang: 'en',
      dir: 'ltr',
    };

    this.setState({
      webNotificationTitle: title,
      options,
    });
  }

  handleNotSupported() {
    this.setState({
      ignore: true,
    });
  }

  handlePermissionGranted() {
    this.setState({
      ignore: false,
    });
  }

  handlePermissionDenied() {
    this.setState({
      ignore: true,
    });
  }

  handleNotificationOnShow() {
    this.playSound();
  }

  playSound() {
    document.getElementById('sound').play();
  }

  render() {
    const divStyle = { display: 'none' };

    return (
      <div>
        <Notification
          title={this.state.webNotificationTitle}
          ignore={this.state.ignoreWebNotification}
          options={this.state.options}
          onShow={this.handleNotificationOnShow}
          timeout={60000}
        />
        <audio id="sound" preload="auto">
          <source
            src="https://s3.amazonaws.com/smspoc-static/notification.mp3"
            type="audio/mpeg"
            style={divStyle}
            preload
          />
        </audio>
      </div>
    );
  }
}

GenericWebNotification.propTypes = {
  guests: React.PropTypes.object,
  selectedGuestId: React.PropTypes.string,
  users: React.PropTypes.object,
  selectedUserId: React.PropTypes.string,
  selfUserId: React.PropTypes.string,
};

export default connect(
  (state) => ({
    guests: state.getIn(['guests', 'items']).toJS(),
    selectedGuestId: state.getIn(['guests', 'selectedId']),
    users: state.getIn(['users', 'items']).toJS(),
    selectedUserId: state.getIn(['users', 'selectedId']),
    selfUserId: state.getIn(['auth', 'user', 'id'], null),
  }),
  () => ({})
)(GenericWebNotification);
