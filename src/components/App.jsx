import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Link } from 'react-router';

import LoginForm from 'components/LoginForm';
import * as actions from 'actions';
import config from 'config';

function AppLink(props) {
  return (
    <div className={`App-nav-link ${props.active ? 'is-selected' : ''}`}>
      <Link to={props.to} onClick={props.onClick}>{props.text}</Link>
    </div>
  );
}

AppLink.propTypes = {
  location: React.PropTypes.object,
  to: React.PropTypes.string,
  text: React.PropTypes.string,
  active: React.PropTypes.bool,
  onClick: React.PropTypes.func,
};

function App(props) {
  if (!props.token) {
    return <LoginForm />;
  }

  const path = props.location.pathname;

  return (
    <div className="App">
      <div className="App-nav">
        <div className="App-nav-logout">
          <a
            href="#"
            onClick={e => { e.preventDefault(); props.logout(); }}
          >
            <i className="fa fa-sign-out" />{' Log out'}
          </a>
        </div>
        <AppLink
          active={path === '/app'}
          to="/app"
          text="Dashboard"
        />
        {props.user.get('isAdmin') ? (
          <div>
            <AppLink
              active={path.startsWith('/app/message-templates')}
              to="/app/message-templates"
              text="Message Templates"
              onClick={props.fetchCannedMessages}
            />
            <AppLink
              active={path.startsWith('/app/users')}
              to="/app/users"
              text="Manage Users"
            />
            <AppLink
              active={path.startsWith('/app/voice-forwarding')}
              to="/app/voice-forwarding"
              text="Voice Forwarding"
            />
            {config.APP_REPORTS === 'true' ? (
              <AppLink
                active={path.startsWith('/app/reports')}
                to={`/app/reports/${props.defaultReportId}`}
                text="Reports"
              />
            ) : ''}
            {config.APP_PAYMENTS === 'true' ? (
              <AppLink
                active={path.startsWith('/app/payment')}
                to="/app/payment"
                text="Payment Settings"
              />
            ) : ''}
            <AppLink
              active={path.startsWith('/app/account-settings')}
              to="/app/account-settings"
              text="Account Settings"
            />
          </div>
        ) : ''}
      </div>
      {props.children}
    </div>
  );
}

App.propTypes = {
  location: React.PropTypes.object,
  children: React.PropTypes.element,
  logout: React.PropTypes.func,
  fetchCannedMessages: React.PropTypes.func,
  token: React.PropTypes.string,
  user: React.PropTypes.instanceOf(Map),
  defaultReportId: React.PropTypes.string,
};

export default connect(
  (state) => ({
    user: state.getIn(['auth', 'user']),
    token: state.getIn(['auth', 'token']),
    defaultReportId: 'sample1',
  }),
  dispatch => ({
    logout: () => dispatch(actions.logout()),
    fetchCannedMessages: () => dispatch(actions.fetchCannedMessages()),
  })
)(App);
