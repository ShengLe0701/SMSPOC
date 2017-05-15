import { fromJS, List } from 'immutable';

import * as actions from 'actions';

export default function jobs(state = fromJS({
  isFetching: false,
  error: null,
  items: new List(),
}), action) {
  switch (action.type) {
    case actions.CREATE_JOB_FAILURE:
      return state.merge({
        isFetching: false,
        error: action,
      });
    case actions.CREATE_JOB_REQUEST:
      return state.merge({
        isFetching: true,
        error: null,
      });
    case actions.CREATE_JOB_SUCCESS:
      return state.merge({
        isFetching: false,
        isUpToDate: true,
        error: null,
        items: state.get('items').push(fromJS(action.job)),
      });
    default:
      return state;
  }
}
