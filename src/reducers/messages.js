import { fromJS, List } from 'immutable';

import * as actions from 'actions';
import * as utils from 'reducers/utils';

function chat(state = fromJS({
  isFetching: false,
  error: null,
  items: new List(),
}), action) {
  switch (action.type) {
    case actions.RECEIVE_MESSAGE:
      return state.update('items', items => items.push(fromJS(action.message)));
    case actions.SEND_MESSAGE_REQUEST:
      return state.update('items', items => items.push(fromJS(action.message)));
    case actions.FETCH_MESSAGES_REQUEST:
      return state.merge({
        isFetching: true,
        error: null,
      });
    case actions.FETCH_MESSAGES_SUCCESS:
      return state.merge({
        isFetching: false,
        isUpToDate: true,
        error: null,
        items: fromJS(action.messages),
      });
    default:
      return state;
  }
}

export default function messages(state = utils.getDefaultChatTypes(), action) {
  switch (action.type) {
    case actions.RECEIVE_MESSAGE:
    case actions.SEND_MESSAGE_REQUEST:
    case actions.FETCH_MESSAGES_REQUEST:
    case actions.FETCH_MESSAGES_SUCCESS:
      return state.updateIn(
        [action.chatType, action.chatId],
        chatState => chat(chatState, action)
      );
    default:
      return state;
  }
}
