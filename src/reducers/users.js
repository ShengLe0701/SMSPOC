import { fromJS, Map } from 'immutable';

import * as actions from 'actions';
import { ChatType } from 'constants';
import * as utils from 'reducers/utils';

export default function users(state = fromJS({
  isFetching: false,
  error: null,
  items: new Map(),
}), action) {
  switch (action.type) {
    case actions.SELECT_GUEST:
      return state.set('selectedId', null);
    case actions.SELECT_USER:
      return state
        .setIn(['items', action.userId, 'hasUnreadMessages'], false)
        .set('selectedId', action.userId);
    case actions.RECEIVE_MESSAGE:
      if (action.chatType === ChatType.USER
          && action.chatId !== state.get('selectedId')) {
        return state.setIn(['items', action.chatId, 'hasUnreadMessages'], true);
      }
      return state;
    case actions.FETCH_MESSAGES_SUCCESS:
      if (action.chatType === ChatType.USER) {
        return state.setIn(['items', action.chatId, 'isChatFetched'], true);
      }
      return state;
    case actions.FETCH_USERS_REQUEST:
      return state.merge({
        isFetching: true,
        error: null,
      });
    case actions.FETCH_USERS_SUCCESS:
      return state.merge({
        isFetching: false,
        error: null,
        items: utils.unflatten(action.users),
      });
    case actions.CREATE_USER_SUCCESS:
      return state.setIn(['items', action.user.id], new Map(action.user));
    case actions.UPDATE_USER_SUCCESS:
      return state.mergeIn(['items', action.user.id], fromJS(action.user));
    default:
      return state;
  }
}
