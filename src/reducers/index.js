import * as actions from 'actions';
import account from 'reducers/account';
import admin from 'reducers/admin';
import auth from 'reducers/auth';
import cannedMessages from 'reducers/cannedMessages';
import contactSearch from 'reducers/contactSearch';
import guests from 'reducers/guests';
import jobs from 'reducers/jobs';
import messages from 'reducers/messages';
import modal from 'reducers/modal';
import native from 'reducers/native';
import reports from 'reducers/reports';
import users from 'reducers/users';
import payment from 'reducers/payment';
import * as utils from 'reducers/utils';

function drafts(state = utils.getDefaultChatTypes(), action) {
  switch (action.type) {
    case actions.UPDATE_DRAFT:
      return state.setIn([action.chatType, action.chatId], action.body);
    case actions.SEND_MESSAGE_REQUEST:
      return state.setIn([action.chatType, action.chatId], '');
    default:
      return state;
  }
}

export default utils.composeReducers([
  utils.combineReducers({
    account,
    admin,
    auth,
    cannedMessages,
    drafts,
    guests,
    jobs,
    messages,
    modal,
    payment,
    reports,
    native,
    users,
  }),
  contactSearch,
]);
