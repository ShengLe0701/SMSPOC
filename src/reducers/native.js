import { combineReducers } from 'reducers/utils';
import * as actions from 'actions/native';

function isMenuOpen(state = false, action) {
  if (action.type === actions.SET_MENU_OPEN) {
    return action.isOpen;
  }
  return state;
}
export default combineReducers({
  isMenuOpen,
});
