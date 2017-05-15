import { fromJS } from 'immutable';
import jwtDecode from 'jwt-decode';

import { combineReducers } from 'reducers/utils';
import * as actions from 'actions';
import { setToken } from 'tokenStore';

function token(state = null, action) {
  switch (action.type) {
    case (actions.FETCH_GUESTS_FAILURE):
      if (action.error.status === 401) {
        return null;
      }
      return state;
    case (actions.LOGIN_SUCCESS):
      setToken(action.data.token);
      return action.data.token;
    case (actions.TOKEN_READ):
      return action.token;
    case (actions.LOGOUT):
      setToken('');
      return '';
    default:
      return state;
  }
}

function isFetching(state = false, action) {
  switch (action.type) {
    case (actions.LOGIN_REQUEST):
      return true;
    case (actions.LOGIN_SUCCESS):
    case (actions.LOGIN_FAILURE):
      return false;
    default:
      return state;
  }
}

function error(state = null, action) {
  switch (action.type) {
    case (actions.LOGIN_FAILURE):
      return action.error;
    case (actions.LOGIN_SUCCESS):
    case (actions.LOGIN_REQUEST):
      return null;
    default:
      return state;
  }
}

function user(state = null, action) {
  switch (action.type) {
    case (actions.FETCH_GUESTS_FAILURE):
      if (action.error.status === 401) {
        return null;
      }
      return state;
    case (actions.LOGIN_SUCCESS):
      return action.data.token ? fromJS(jwtDecode(action.data.token)) : null;
    case (actions.TOKEN_READ):
      return action.token ? fromJS(jwtDecode(action.token)) : null;
    case (actions.LOGOUT):
      return null;
    default:
      return state;
  }
}

function apiKey(state = null, action) {
  switch (action.type) {
    case actions.CREATE_API_KEY_SUCCESS:
      return action.apiKey;
    case action.CREATE_API_KEY_REQUEST:
      return null;
    default:
      return state;
  }
}

export default combineReducers({
  token,
  isFetching,
  error,
  user,
  apiKey,
});

