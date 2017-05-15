import React from 'react';
import { Map } from 'immutable';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import * as actions from 'actions';

function AccountPanel(props) {
  if (!props.user) {
    return <div></div>;
  }

  const adminLink = props.user.get('isAdmin') ?
    (<Link className="AccountPanel-admin" to="/app/admin">Admin</Link>) : '';

  return (
    <div className="AccountPanel">
      <span className="AccountPanel-email">
        {props.user.get('email')}
      </span>
      {adminLink}
      <a
        className="AccountPanel-logout"
        href="#"
        onClick={e => { e.preventDefault(); props.onLogout(); }}
      >
        Log out
      </a>
    </div>
  );
}

AccountPanel.propTypes = {
  user: React.PropTypes.instanceOf(Map),
  onLogout: React.PropTypes.func,
};

export default connect(
  state => ({
    user: state.getIn(['auth', 'user']),
  }),
  dispatch => ({
    onLogout: () => dispatch(actions.logout()),
  })
)(AccountPanel);
