import { fromJS } from 'immutable';

import * as actions from 'actions';

export default function account(state = fromJS({
  isFetching: false,
  error: null,
  forwardingPhone: null,
}), action) {
  switch (action.type) {
    case actions.FETCH_ACCOUNT_FAILURE:
    case actions.UPDATE_ACCOUNT_FAILURE:
      return state.merge({
        isFetching: false,
        error: action,
      });
    case actions.FETCH_ACCOUNT_REQUEST:
    case actions.UPDATE_ACCOUNT_REQUEST:
      return state.merge({
        isFetching: true,
        error: null,
      });
    case actions.FETCH_ACCOUNT_SUCCESS:
    case actions.UPDATE_ACCOUNT_SUCCESS:
      return state.merge(action.account, {
        isFetching: false,
        error: null,
      });
    default:
      return state;
  }
}
