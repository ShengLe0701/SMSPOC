import { Map } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';

import * as actions from 'actions';
import Page from 'components/Page';

class VoiceForwarding extends React.Component {
  constructor(props) {
    super(props);

    this.radioInput = '';
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSetVoiceForwarding(this.radioInput);
  }

  render() {
    const forwardingPhone = this.props.account.get('forwardingPhone');
    const none = (
      <div key="none" className="form-check">
        <label className="form-check-label">
          <input
            type="radio"
            className="form-check-input"
            name="optionsRadios"
            id="option-none"
            value=""
            defaultChecked={`${!forwardingPhone ? 'true' : ''}`}
            onChange={e => {
              this.radioInput = e.target.value;
            }}
          />
          No forwarding
        </label>
      </div>
    );

    const userList = this.props.users
      .toList()
      .filter(user => !!user.get('phone'))
      .map(user => (
        <div key={`user-${user.get('id')}`} className="form-check">
          <label className="form-check-label">
            <input
              type="radio"
              className="form-check-input"
              name="optionsRadios"
              id={`option-${user.get('id')}`}
              value={`${user.get('phone')}`}
              defaultChecked={`${user.get('phone') === forwardingPhone ? 'true' : ''}`}
              onChange={e => {
                this.radioInput = e.target.value;
              }}
            />
            {user.get('name')}, {user.get('phone')}
          </label>
        </div>
      ));

    return (
      <Page>
        <h1 className="mb-4">Voice Forwarding</h1>
        <div className="VoiceForwarding">
          <div className="VoiceForwarding-header">
          </div>
          <div className="VoiceForwarding-body">
            <form onSubmit={this.handleSubmit}>
              <fieldset className="form-group">
                <label>Forward Calls to the following user:</label>
                {none}
                {userList}
              </fieldset>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
          <div className="VoiceForwarding-footer">
            Currently forwarding to: {this.props.account.get('forwardingPhone') || 'No one'}
          </div>
        </div>
      </Page>
    );
  }
}

VoiceForwarding.propTypes = {
  onSetVoiceForwarding: React.PropTypes.func,
  account: React.PropTypes.instanceOf(Map),
  users: React.PropTypes.instanceOf(Map),
};

export default connect(
  state => ({
    account: state.getIn(['account']),
    users: state.getIn(['users', 'items']),
  }),
  dispatch => ({
    onSetVoiceForwarding: (phone) => (
      dispatch(actions.updateAccount({ forwardingPhone: phone }))
    ),
  })
)(VoiceForwarding);
