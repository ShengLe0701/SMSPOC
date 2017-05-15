import { Map } from 'immutable';

import * as actions from 'actions';

export default function admin(state = new Map(), action) {
  switch (action.type) {
    case actions.SET_SELECTED_USER:
      return state.setIn(['selectedUser'], action.user);
    default:
      return state;
  }
}
