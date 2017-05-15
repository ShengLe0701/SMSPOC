import { Map } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import autosize from 'autosize';

import * as actions from 'actions';
import Page from 'components/Page';

class AccountSettings extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    autosize(this.textarea);
  }

  componentDidUpdate() {
    autosize.update(this.textarea);
  }

  componentWillUnmount() {
    autosize.destroy(this.textarea);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSetApiKey({ apiKey: this.props.apiKey });
  }

  render() {
    return (
      <Page>
        <h1 className="mb-4">Account Settings</h1>
        <div className="AccountSettings">
          <div className="AccountSettings-header">
          </div>
          <div className="AccountSettings-body">
            <form className="form-group" onSubmit={this.handleSubmit}>
              <label>API Key</label>
              <div className="form-group input-group">
                <textarea
                  className="form-control col-xl-8"
                  name="api-key"
                  type="text"
                  value={this.props.apiKey}
                />
                <span className="input-group-btn">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.props.onGenerateApiKey();
                    }}
                  >
                    Generate New Key
                  </button>
                </span>
              </div>
              <button className="btn btn-primary" type="submit">Save</button>
            </form>
            <div className="AccountSettings-footer">
              Saved API Key:
              <span className="AccountSettings-footer-apiKey">
                {this.props.account.get('apiKey') || 'None'}
              </span>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

AccountSettings.propTypes = {
  account: React.PropTypes.instanceOf(Map),
  apiKey: React.PropTypes.string,
  onGenerateApiKey: React.PropTypes.func,
  onSetApiKey: React.PropTypes.func,
};

export default connect(
  state => ({
    account: state.getIn(['account']),
    apiKey: state.getIn(['auth', 'apiKey'], '') || '',
  }),
  dispatch => ({
    onGenerateApiKey: () => (
      dispatch(actions.createApiKey())
    ),
    onSetApiKey: (key) => (
      dispatch(actions.updateAccount(key))
    ),
  })
)(AccountSettings);
