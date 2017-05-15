import { fromJS, List } from 'immutable';

import * as actions from 'actions';

export default function cannedMessages(state = fromJS({
  isFetching: false,
  error: null,
  items: new List(),
}), action) {
  switch (action.type) {
    case actions.FETCH_CANNED_MESSAGES_REQUEST:
      return state.merge({
        isFetching: true,
        error: null,
      });
    case actions.FETCH_CANNED_MESSAGES_SUCCESS:
      return state.merge({
        isFetching: false,
        isUpToDate: true,
        error: null,
        items: fromJS(action.cannedMessages),
      });
    case actions.CREATE_CANNED_MESSAGE_SUCCESS:
      return state.update('items', i => i.push(fromJS(action.cannedMessage)));
    case actions.SET_SELECTED_CANNED_MESSAGE:
      return state.set('selected', fromJS(action.cannedMessage));
    case actions.UPDATE_SELECTED_CANNED_MESSAGE:
      return state.set('selected', fromJS(action.cannedMessage));
    case actions.UPDATE_CANNED_MESSAGE_SUCCESS:
      return state.setIn(
        ['items', state.get('items').findIndex(i => i.get('id') === action.cannedMessage.id)],
        fromJS(action.cannedMessage)
      );
    case actions.DELETE_CANNED_MESSAGE_FAILURE:
      return state;
    case actions.DELETE_CANNED_MESSAGE_SUCCESS:
      return state.deleteIn(
        ['items', state.get('items').findIndex(i => i.get('id') === action.cannedMessage.id)]);
    default:
      return state;
  }
}
