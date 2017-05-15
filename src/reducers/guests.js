import { fromJS, Map } from 'immutable';

import * as actions from 'actions';
import * as utils from 'reducers/utils';
import * as reactions from 'reactions';
import { ChatType } from 'constants';

export default function guests(state = fromJS({
  isFetching: false,
  error: null,
  items: new Map(),
}), action) {
  let items;
  switch (action.type) {
    case actions.SELECT_USER:
      return state.set('selectedId', null);
    case actions.SELECT_GUEST:
      return state
        .setIn(['items', action.guestId, 'hasUnreadMessages'], false)
        .set('selectedId', action.guestId);
    case actions.RECEIVE_MESSAGE:
      if (action.chatType === ChatType.GUEST) {
        if (action.chatId === state.get('selectedId')) {
          return state.setIn(
            ['items', action.chatId, 'lastMessageAt'],
            new Date(action.message.createdAt)
          );
        }
        return state
          .mergeIn(['items', action.chatId], {
            hasUnreadMessages: true,
            lastMessageAt: new Date(action.message.createdAt),
          });
      }
      return state;
    case actions.SEND_MESSAGE_REQUEST:
      if (action.chatType === ChatType.GUEST) {
        return state.setIn(
          ['items', action.chatId, 'lastMessageAt'],
          new Date(action.message.createdAt)
        );
      }
      return state;
    case actions.CREATE_GUEST_SUCCESS:
      return state.setIn(['items', action.guest.id], fromJS(action.guest));
    case actions.FETCH_MESSAGES_SUCCESS:
      if (action.chatType === ChatType.GUEST) {
        return state.setIn(['items', action.chatId, 'isChatFetched'], true);
      }
      return state;
    case actions.FETCH_GUESTS_REQUEST:
      return state.merge({
        isFetching: true,
        error: null,
      });
    case actions.FETCH_GUESTS_SUCCESS:
      items = utils.unflatten(action.guests);
      return state.merge({
        isFetching: false,
        error: null,
        selectedId: reactions.displayableGuestsFromItems(items).getIn([0, 'id']),
        items,
      });
    case actions.RECEIVE_ADD_GUEST:
      return state.mergeIn(['items', action.guest.id], action.guest);
    case actions.RECEIVE_UPDATE_GUEST:
    case actions.UPDATE_GUEST_SUCCESS:
      return state.mergeIn(['items', action.guest.id], action.guest);
    case actions.CREATE_GUEST_FAILURE:
    case actions.UPDATE_GUEST_FAILURE:
      return state.merge({
        isFetching: false,
        error: action.error,
      });
    case actions.CLEAR_MODAL_ERRORS:
      return state.merge({
        error: null,
      });
    case actions.CALL_GUEST_REQUEST:
      return state.merge({
        isFetching: true,
        error: null,
      });
    case actions.CALL_GUEST_SUCCESS:
      return state.merge({
        isFetching: false,
        error: null,
      });
    default:
      return state;
  }
}
