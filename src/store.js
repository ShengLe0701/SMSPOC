import _ from 'lodash';
import * as redux from 'redux';
import thunkMiddleware from 'redux-thunk';

import reducer from 'reducers';
import * as actions from 'actions';
import { ChatType } from 'constants.js';

let devTools;
if (typeof(window) !== 'undefined') {
  /* eslint-disable */
  console.log('Loading Redux developer tools');
  devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
  /* eslint-enable */
}

const store = redux.createStore(
  reducer,
  redux.compose(
    redux.applyMiddleware(thunkMiddleware),
    devTools || _.identity
  )
);

function observeStore(path, onChange) {
  let currentState;

  function handleChange() {
    const nextState = store.getState().getIn(path);
    if (!nextState.equals(currentState)) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

observeStore(['guests'], guests => {
  const id = guests.get('selectedId');
  if (id && !guests.getIn(['items', id, 'isChatFetched'])) {
    store.dispatch(actions.fetchMessages(ChatType.GUEST, id));
  }
});

observeStore(['users'], users => {
  const id = users.get('selectedId');
  if (id && !users.getIn(['items', id, 'isChatFetched'])) {
    store.dispatch(actions.fetchMessages(ChatType.USER, id));
  }
});

export default store;
