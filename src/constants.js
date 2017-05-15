import { Map, Set } from 'immutable';

export const MessageDirection = {
  TO_GUEST: 0,
  FROM_GUEST: 1,
  INTERNAL: 2,
};

export const CannedMessageType = {
  TEMPLATE: 0,
  ON_UNVERIFIED_CONTACT: 1,
};

export const ChatType = {
  GUEST: 'GUEST',
  USER: 'USER',
};

export const SocketCommands = {
  MESSAGE: 'message',
  MESSAGE_ERROR: 'MESSAGE_ERROR',
  ADD_GUEST: 'ADD_GUEST',
  UPDATE_GUEST: 'UPDATE_GUEST',
};

export const ModalType = {
  CREATE_CANNED_MESSAGE: 'CREATE_CANNED_MESSAGE',
  DELETE_CANNED_MESSAGE: 'DELETE_CANNED_MESSAGE',
  EDIT_CANNED_MESSAGE: 'EDIT_CANNED_MESSAGE',
  CREATE_GUEST_INFO: 'CREATE_GUEST_INFO',
  EDIT_GUEST_INFO: 'EDIT_GUEST_INFO',
  CREATE_USER: 'CREATE_USER',
  EDIT_USER: 'EDIT_USER',
  SCHEDULE_MESSAGE: 'SCHEDULE_MESSAGE',
  SEARCH_GUEST: 'SEARCH_GUEST',
  SEARCH_USER: 'SEARCH_USER',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  CALL_GUEST: 'CALL_GUEST',
};

export const NewCannedMessage = new Map({
  id: '-1',
  type: 0,
  active: false,
});

export const NewUser = new Map({
  id: '-1',
});

export const Salt = {
  ROUNDS: 5,
};

export const SmsKeywords = {
  STOP: new Set(['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT']),
  START: new Set(['START', 'YES', 'UNSTOP']),
  HELP: new Set(['HELP', 'INFO']),
};

export const ScheduledJob = {
  SMS: 'SMS',
};

export const DBNotify = {
  ARCHIVE_GUEST: 'ARCHIVE_GUEST',
  NEW_MESSAGE: 'NEW_MESSAGE',
};

export const JobType = {
  ARCHIVE_GUEST: 'ARCHIVE_GUEST',
  SMS: 'SMS',
};
