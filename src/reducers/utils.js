import { fromJS, Map, List } from 'immutable';

import { ChatType } from 'constants.js';

export function unflatten(data) {
  return fromJS(data).reduce(
    (map, item) => map.set(item.get('id'), item),
    new Map()
  );
}

export function getDefaultChatTypes() {
  return new Map()
    .set(ChatType.GUEST, new Map())
    .set(ChatType.USER, new Map());
}

export function composeReducers(reducers) {
  return new List(reducers)
    .reduce((prevReducer, nextReducer) => (
      (state, action) => nextReducer(prevReducer(state, action), action)
    ), (state) => state);
}

// Our own implementation that supports nesting
// combineReducers calls and doesn't print warnings
// about unexpected keys.
export function combineReducers(config) {
  return new Map(config)
    .reduce((accReducer, keyReducer, key) => (
      (state, action) => (
        accReducer(state, action)
          .update(key, value => keyReducer(value, action))
      )
    ), (state = new Map()) => state);
}
