import { fromJS, Map, Set } from 'immutable';

import { ChatType } from 'constants.js';
import * as actions from 'actions';
import { combineReducers, composeReducers } from 'reducers/utils';

const GUESTS_ACTIONS = new Set([
  actions.FETCH_GUESTS_SUCCESS,
  actions.RECEIVE_ADD_GUEST,
  actions.CREATE_GUEST_SUCCESS,
  actions.UPDATE_GUEST_SUCCESS,
]);

const USERS_ACTIONS = new Set([
  actions.FETCH_USERS_SUCCESS,
  actions.CREATE_USER_SUCCESS,
  actions.UPDATE_USER_SUCCESS,
]);

function doUpdateResults(state, chatType, query) {
  let contacts;
  if (chatType === ChatType.GUEST) {
    contacts = state.getIn(['guests', 'items']);
  } else {
    const selfId = state.getIn(['auth', 'user', 'id']);
    contacts = state.getIn(['users', 'items']).delete(selfId);
  }

  const results = contacts
    .valueSeq()
    .filter(c => {
      const bPhone = (c.get('phone') || '').includes(query);
      const bName = (c.get('name') || '').toLowerCase().includes(query.toLowerCase());
      const bEmail = (c.get('email') || '').includes(query);
      const bRoom = (c.get('room') || '').includes(query);

      return bPhone || bName || bEmail || bRoom;
    });

  return state.setIn(['contactSearch', chatType, 'results'], results);
}

function updateResults(state, action) {
  if (action.type === actions.UPDATE_CONTACT_SEARCH_QUERY) {
    return doUpdateResults(state, action.chatType, action.query);
  }

  if (GUESTS_ACTIONS.contains(action.type)) {
    const query = state.getIn(['contactSearch', ChatType.GUEST, 'query']);
    return doUpdateResults(state, ChatType.GUEST, query);
  }

  if (USERS_ACTIONS.contains(action.type)) {
    const query = state.getIn(['contactSearch', ChatType.USER, 'query']);
    return doUpdateResults(state, ChatType.USER, query);
  }

  return state;
}

function getDefaultState() {
  const item = fromJS({ query: '', results: [] });
  return new Map()
    .set(ChatType.GUEST, item)
    .set(ChatType.USER, item);
}

function contactSearch(state = getDefaultState(), action) {
  switch (action.type) {
    case actions.UPDATE_CONTACT_SEARCH_QUERY:
      return state.setIn([action.chatType, 'query'], action.query);
    default:
      return state;
  }
}

export default composeReducers([
  // TODO(ivan): Using more than one combined reducer on the same
  // level of the state tree causes the unexpected key warning.
  combineReducers({ contactSearch }),
  updateResults,
]);
