import $ from 'jquery';

import * as actions from 'actions';

export default function modal(state = null, action) {
  // TODO: Reducers must not have side effects.
  switch (action.type) {
    case actions.SHOW_MODAL:
      $('#sd-modal').modal('show');
      return action.modal;
    case actions.HIDE_MODAL:
      $('#sd-modal').modal('hide');
      return '';
    default:
      return state;
  }
}
