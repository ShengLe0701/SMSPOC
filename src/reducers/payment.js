import { fromJS } from 'immutable';

import * as actions from 'actions/payment';

export default function account(state = fromJS({
  isFetching: false,
  error: null,
}), action) {
  switch (action.type) {
    case actions.UPDATE_PAYMENT_FAILURE:
      return state.merge({
        isFetching: false,
        error: action.error,
      });
    case actions.UPDATE_PAYMENT_REQUEST:
      return state.merge({
        isFetching: true,
        error: null,
      });
    case actions.UPDATE_PAYMENT_SUCCESS:
      return state.merge(action.payment, {
        isFetching: false,
        error: null,
      });
    default:
      return state;
  }
}
