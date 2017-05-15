import React from 'react';
import { connect } from 'react-redux';

import Dashboard from 'components/native/Dashboard';
import LoginForm from 'components/native/LoginForm';
import * as actions from 'actions';

function Router(props) {
  if (!props.token) {
    return <LoginForm />;
  }

  return <Dashboard />;
}

Router.propTypes = {
  token: React.PropTypes.string,
};

export default connect(
  (state) => ({
    token: state.getIn(['auth', 'token']),
  }),
  dispatch => ({
    logout: () => dispatch(actions.logout()),
  })
)(Router);
