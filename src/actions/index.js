import _ from 'lodash';
import io from 'socket.io-client';

import { MessageDirection, ChatType, SocketCommands } from 'constants.js';
import { getToken } from 'tokenStore';
import config from 'config';
import { request, auth } from 'actions/utils';

export const TOKEN_READ = 'TOKEN_READ';

export const SELECT_GUEST = 'SELECT_GUEST';
export const SELECT_USER = 'SELECT_USER';
export const UPDATE_DRAFT = 'UPDATE_DRAFT';

export const CREATE_GUEST_REQUEST = 'CREATE_GUEST_REQUEST';
export const CREATE_GUEST_SUCCESS = 'CREATE_GUEST_SUCCESS';
export const CREATE_GUEST_FAILURE = 'CREATE_GUEST_FAILURE';

export const CREATE_CANNED_MESSAGE_REQUEST = 'CREATE_CANNED_MESSAGE_REQUEST';
export const CREATE_CANNED_MESSAGE_SUCCESS = 'CREATE_CANNED_MESSAGE_SUCCESS';

export const UPDATE_CANNED_MESSAGE_REQUEST = 'UPDATE_CANNED_MESSAGE_REQUEST';
export const UPDATE_CANNED_MESSAGE_SUCCESS = 'UPDATE_CANNED_MESSAGE_SUCCESS';

export const DELETE_CANNED_MESSAGE_REQUEST = 'DELETE_CANNED_MESSAGE_REQUEST';
export const DELETE_CANNED_MESSAGE_SUCCESS = 'DELETE_CANNED_MESSAGE_SUCCESS';
export const DELETE_CANNED_MESSAGE_FAILURE = 'DELETE_CANNED_MESSAGE_FAILURE';

export const SEND_MESSAGE_REQUEST = 'SEND_MESSAGE_REQUEST';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
export const RECEIVE_ADD_GUEST = 'RECEIVE_ADD_GUEST';
export const RECEIVE_UPDATE_GUEST = 'RECEIVE_UPDATE_GUEST';
export const MESSAGE_DELIVERY_ERROR = 'MESSAGE_DELIVERY_ERROR';

export const FETCH_GUESTS_REQUEST = 'FETCH_GUESTS_REQUEST';
export const FETCH_GUESTS_SUCCESS = 'FETCH_GUESTS_SUCCESS';
export const FETCH_GUESTS_FAILURE = 'FETCH_GUESTS_FAILURE';

export const UPDATE_GUEST_REQUEST = 'UPDATE_GUEST_REQUEST';
export const UPDATE_GUEST_SUCCESS = 'UPDATE_GUEST_SUCCESS';
export const UPDATE_GUEST_FAILURE = 'UPDATE_GUEST_FAILURE';

export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

export const FETCH_MESSAGES_REQUEST = 'FETCH_MESSAGES_REQUEST';
export const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS';

export const FETCH_CANNED_MESSAGES_REQUEST = 'FETCH_CANNED_MESSAGES_REQUEST';
export const FETCH_CANNED_MESSAGES_SUCCESS = 'FETCH_CANNED_MESSAGES_SUCCESS';

export const SET_SELECTED_CANNED_MESSAGE = 'SET_SELECTED_CANNED_MESSAGE';
export const UPDATE_SELECTED_CANNED_MESSAGE = 'UPDATE_SELECTED_CANNED_MESSAGE';
export const SET_SELECTED_USER = 'SET_SELECTED_USER';

export const HIDE_MODAL = 'HIDE_MODAL';
export const SHOW_MODAL = 'SHOW_MODAL';
export const CLEAR_MODAL_ERRORS = 'CLEAR_MODAL_ERRORS';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const CREATE_USER_REQUEST = 'CREATE_USER_REQUEST';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

export const UPDATE_CONTACT_SEARCH_QUERY = 'UPDATE_CONTACT_SEARCH_QUERY';

export const WAITLIST_FAILURE = 'WAITLIST_FAILURE';
export const WAITLIST_REQUEST = 'WAITLIST_REQUEST';
export const WAITLIST_SUCCESS = 'WAITLIST_SUCCESS';

export const FETCH_REPORT_DATA_REQUEST = 'FETCH_REPORT_DATA_REQUEST';
export const FETCH_REPORT_DATA_SUCCESS = 'FETCH_REPORT_DATA_SUCCESS';
export const FETCH_REPORT_DATA_FAILURE = 'FETCH_REPORT_DATA_FAILURE';

export const FETCH_ACCOUNT_FAILURE = 'FETCH_ACCOUNT_FAILURE';
export const FETCH_ACCOUNT_REQUEST = 'FETCH_ACCOUNT_REQUEST';
export const FETCH_ACCOUNT_SUCCESS = 'FETCH_ACCOUNT_SUCCESS';

export const UPDATE_ACCOUNT_FAILURE = 'UPDATE_ACCOUNT_FAILURE';
export const UPDATE_ACCOUNT_REQUEST = 'UPDATE_ACCOUNT_REQUEST';
export const UPDATE_ACCOUNT_SUCCESS = 'UPDATE_ACCOUNT_SUCCESS';

export const CREATE_JOB_REQUEST = 'CREATE_JOB_REQUEST';
export const CREATE_JOB_SUCCESS = 'CREATE_JOB_SUCCESS';
export const CREATE_JOB_FAILURE = 'CREATE_JOB_FAILURE';

export const CALL_GUEST_REQUEST = 'CALL_GUEST_REQUEST';
export const CALL_GUEST_SUCCESS = 'CALL_GUEST_SUCCESS';

export const CREATE_API_KEY_REQUEST = 'CREATE_API_KEY_REQUEST';
export const CREATE_API_KEY_SUCCESS = 'CREATE_API_KEY_SUCCESS';

export const LOGOUT = 'LOGOUT';

let socket;

export function hideModal() {
  return dispatch => {
    dispatch({ type: HIDE_MODAL });
    dispatch({ type: CLEAR_MODAL_ERRORS });
  };
}

export function showModal(modal) {
  return { type: SHOW_MODAL, modal };
}

export function updateContactSearchQuery(chatType, query) {
  return { type: UPDATE_CONTACT_SEARCH_QUERY, chatType, query };
}

export function dispatchNotification(action) {
  if (BUILD_TARGET !== 'native') {
    // TODO(ivan): Don't create an event, use actions/state.
    // Implement notifications in React Native.
    const event = new CustomEvent('web-event', { detail: action });
    document.getElementById('web-notification').dispatchEvent(event);
  }
}

export function receiveMessage(message) {
  return (dispatch, getState) => {
    const action = {
      type: RECEIVE_MESSAGE,
      message,
    };

    if (message.direction === MessageDirection.INTERNAL) {
      const chatId = message.senderId === getState().getIn(['auth', 'user', 'id'])
                   ? message.receiverId
                   : message.senderId;
      _.assign(action, {
        chatType: ChatType.USER,
        chatId,
      });
    } else {
      _.assign(action, {
        chatId: message.guestId,
        chatType: ChatType.GUEST,
      });
    }

    dispatch(action);
    dispatchNotification(action);
  };
}

export function messageDeliveryError(guestId) {
  return { type: MESSAGE_DELIVERY_ERROR, guestId };
}

export function receiveAddGuest(guest) {
  return { type: RECEIVE_ADD_GUEST, guest };
}

export function receiveUpdateGuest(guest) {
  return { type: RECEIVE_UPDATE_GUEST, guest };
}

export function fetchMessages(chatType, chatId) {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_MESSAGES_REQUEST, chatId, chatType });

    const doRequest = chatType === ChatType.GUEST ? (
      auth('GET', `/api/guests/${chatId}/messages`, getState)
    ) : (
      auth('GET', `/api/users/${chatId}/messages`, getState)
    );

    // TODO(ivan): take care of FETCH_MESSAGES_FAILURE.
    return doRequest
      .then(response => response.body)
      .then(messages => dispatch({
        type: FETCH_MESSAGES_SUCCESS,
        chatId,
        chatType,
        messages,
      }));
  };
}

export function updateGuest(guest) {
  return (dispatch, getState) => {
    dispatch({ type: UPDATE_GUEST_REQUEST, guest });

    return auth('PUT', `/api/guests/${guest.id}`, getState)
      .type('form')
      .send(guest)
      .then(response => {
        dispatch({ type: UPDATE_GUEST_SUCCESS, guest: response.body });
        dispatch(hideModal());
      })
      .catch(error => dispatch({ type: UPDATE_GUEST_FAILURE, error: error.response.body }));
  };
}

export function selectGuest(guestId) {
  return { type: SELECT_GUEST, guestId };
}

export function selectUser(userId) {
  return { type: SELECT_USER, userId };
}

export function updateDraft(chatType, chatId, body) {
  return { type: UPDATE_DRAFT, chatType, chatId, body };
}

export function sendMessage(chatType, chatId, payload) {
  return (dispatch, getState) => {
    const message = _.defaults({
      createdAt: Date.now(),
      senderId: getState().getIn(['auth', 'user', 'id']),
      accountId: getState().getIn(['auth', 'user', 'accountId']),
    }, payload);

    if (chatType === ChatType.GUEST) {
      _.assign(message, {
        guestId: chatId,
        direction: MessageDirection.TO_GUEST,
      });
    } else {
      _.assign(message, {
        receiverId: chatId,
        direction: MessageDirection.INTERNAL,
      });
    }

    dispatch({
      type: SEND_MESSAGE_REQUEST,
      chatId,
      chatType,
      message,
    });

    // TODO(ivan): Handle response.
    socket.send(message);
  };
}

export function sendTextMessage(chatType, chatId, body) {
  return sendMessage(chatType, chatId, { body });
}

export function sendFileMessage(chatType, chatId, file) {
  return (dispatch, getState) => {
    const formData = new FormData();
    formData.append('file', file);

    auth('POST', '/uploads/files', getState)
      .send(formData)
      .then(res => {
        dispatch(sendMessage(chatType, chatId, {
          uploadUrl: res.body.url,
          uploadName: res.body.name,
          uploadKey: res.body.key,
        }));
      });
  };
}

function connectSocket(dispatch, getState) {
  socket = io(config.BASE_URL, { jsonp: false });
  socket.on('connect', () => {
    socket.emit('authenticate', { token: getState().getIn(['auth', 'token']) });
  });

  socket.on(SocketCommands.MESSAGE, message => {
    dispatch(receiveMessage(message));
  });

  socket.on(SocketCommands.MESSAGE_ERROR, error => {
    dispatch(messageDeliveryError(error.guestId));
  });

  socket.on(SocketCommands.ADD_GUEST, guest => {
    dispatch(receiveAddGuest(guest));
  });

  socket.on(SocketCommands.UPDATE_GUEST, guest => {
    dispatch(receiveUpdateGuest(guest));
  });
}

export function fetchGuests() {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_GUESTS_REQUEST });

    return auth('GET', '/api/guests', getState)
      .then(response => response.body)
      .then(guests => {
        dispatch({ type: FETCH_GUESTS_SUCCESS, guests });
        connectSocket(dispatch, getState);
      })
      .catch(error => dispatch({ type: FETCH_GUESTS_FAILURE, error }));
  };
}

export function fetchUsers() {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_USERS_REQUEST });

    // TODO(ivan): take care of FETCH_USERS_FAILURE.
    return auth('GET', '/api/users', getState)
      .then(response => response.body)
      .then(users => {
        dispatch({ type: FETCH_USERS_SUCCESS, users });
      })
      .catch(error => dispatch({ type: FETCH_USERS_FAILURE, error }));
  };
}

export function fetchCannedMessages() {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_CANNED_MESSAGES_REQUEST });

    const doRequest = (
      auth('GET', '/api/canned-messages', getState)
    );

    // TODO(vinny): take care of FETCH_CANNED_MESSAGES_FAILURE.
    return doRequest
      .then(response => response.body)
      .then(cannedMessages => dispatch({
        type: FETCH_CANNED_MESSAGES_SUCCESS,
        cannedMessages,
      }));
  };
}

export function createGuest(form) {
  return (dispatch, getState) => {
    dispatch({ type: CREATE_GUEST_REQUEST });

    return auth('POST', '/api/guests', getState)
      .type('form')
      .send(form)
      .then(response => {
        dispatch({
          type: CREATE_GUEST_SUCCESS,
          guest: response.body,
        });
        dispatch(hideModal());
      })
      .catch(error => {
        dispatch({
          type: CREATE_GUEST_FAILURE,
          error: error.response.body,
        });
      });
  };
}

export function createCannedMessage(data) {
  return (dispatch, getState) => {
    dispatch({ type: CREATE_CANNED_MESSAGE_REQUEST });

    return auth('POST', '/api/canned-messages', getState)
      .type('form')
      .send(data)
      .then(response => dispatch({
        type: CREATE_CANNED_MESSAGE_SUCCESS,
        cannedMessage: response.body,
      }));
  };
}

export function updateCannedMessage(data, id) {
  return (dispatch, getState) => {
    dispatch({ type: UPDATE_CANNED_MESSAGE_REQUEST });

    return auth('PUT', `/api/canned-messages/${id}`, getState)
      .type('form')
      .send(data)
      .then(response => dispatch({
        type: UPDATE_CANNED_MESSAGE_SUCCESS,
        cannedMessage: response.body,
      }));
  };
}

export function deleteCannedMessage(id) {
  return (dispatch, getState) => {
    dispatch({ type: DELETE_CANNED_MESSAGE_REQUEST });

    return auth('DELETE', `/api/canned-messages/${id}`, getState)
      .then(response => dispatch({
        type: DELETE_CANNED_MESSAGE_SUCCESS,
        cannedMessage: response.body,
      }));
  };
}

export function createUser(data) {
  return (dispatch, getState) => {
    dispatch({ type: CREATE_USER_REQUEST });

    return auth('POST', '/api/users', getState)
      .type('form')
      .send(data)
      .then(response => dispatch({
        type: CREATE_USER_SUCCESS,
        user: response.body,
      }));
  };
}

export function updateUser(user) {
  return (dispatch, getState) => {
    dispatch({ type: UPDATE_USER_REQUEST });

    return auth('PUT', `/api/users/${user.id}`, getState)
      .type('form')
      .send(user)
      .then(response => dispatch({
        type: UPDATE_USER_SUCCESS,
        user: response.body,
      }));
  };
}

export function fetchAccount() {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_ACCOUNT_REQUEST });

    const doRequest = (
      auth('GET', '/api/accounts', getState)
    );

    return doRequest
      .then(response => response.body[0])
      .then(account => dispatch({
        type: FETCH_ACCOUNT_SUCCESS,
        account,
      }))
      .catch(error => {
        dispatch({
          type: FETCH_ACCOUNT_FAILURE,
          error,
        });
      });
  };
}

export function updateAccount(data) {
  return (dispatch, getState) => {
    const acctId = getState().getIn(['auth', 'user', 'accountId']);
    const updatedAccount = _.assign({}, getState().getIn(['account']).toJS(), data);

    dispatch({ type: UPDATE_ACCOUNT_REQUEST });

    return auth('PUT', `/api/accounts/${acctId}`, getState)
      .type('form')
      .send(updatedAccount)
      .then(response => dispatch({
        type: UPDATE_ACCOUNT_SUCCESS,
        account: response.body,
      }))
      .catch(error => {
        dispatch({
          type: UPDATE_ACCOUNT_FAILURE,
          error,
        });
      });
  };
}

export function login(form) {
  return dispatch => {
    dispatch({ type: LOGIN_REQUEST });
console.log("login")
    return request('POST', '/auth/login')
      .type('form')
      .send(form)
      .then(response => {
        dispatch({
          type: LOGIN_SUCCESS,
          data: response.body,
        });

console.log("login_ok")
        dispatch(fetchGuests());
        dispatch(fetchUsers());
        dispatch(fetchCannedMessages());
        dispatch(fetchAccount());
      })
      .catch(error => { 
        dispatch({
          type: LOGIN_FAILURE,
          error,
        })

console.log("login_error")
console.log(error)
        
      });
  };
}

export function logout() {
  return dispatch => {
    dispatch({ type: LOGOUT });
    socket.disconnect();
  };
}

export function setSelectedCannedMessage(cannedMessage) {
  return { type: SET_SELECTED_CANNED_MESSAGE, cannedMessage };
}

export function updateSelectedCannedMessage(cannedMessage) {
  return { type: UPDATE_SELECTED_CANNED_MESSAGE, cannedMessage };
}

export function setSelectedUser(user) {
  return { type: SET_SELECTED_USER, user };
}

export function sendEmail(form) {
  return dispatch => {
    dispatch({ type: WAITLIST_REQUEST });

    return request('POST', '/email/waitlist')
      .type('form')
      .send(form)
      .then(() => {
        dispatch({
          type: WAITLIST_SUCCESS,
        });
      })
      .catch(error => dispatch({
        type: WAITLIST_FAILURE,
        error,
      }));
  };
}

export function fetchReportData() {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_REPORT_DATA_REQUEST });

    const doRequest = (
      auth('GET', '/reports', getState)
    );

    return doRequest
      .then(response => response.body)
      .then(reportData => dispatch({
        type: FETCH_REPORT_DATA_SUCCESS,
        reportData,
      }))
      .catch(error => dispatch({
        type: FETCH_REPORT_DATA_FAILURE,
        error,
      }));
  };
}

export function createJob(data) {
  return (dispatch, getState) => {
    dispatch({ type: CREATE_JOB_REQUEST });

    return auth('POST', '/api/scheduled-jobs', getState)
      .type('form')
      .send(data)
      .then(response => dispatch({
        type: CREATE_JOB_SUCCESS,
        job: response.body,
      }));
  };
}

export function callGuest(data) {
  return (dispatch, getState) => {
    dispatch({ type: CALL_GUEST_REQUEST });

    return auth('POST', '/api/guests/call', getState)
      .type('form')
      .send(data)
      .then(() => {
        dispatch({ type: CALL_GUEST_SUCCESS });
        dispatch(hideModal());
      });
  };
}

export function createApiKey() {
  return (dispatch, getState) => {
    dispatch({ type: CREATE_API_KEY_REQUEST });

    return auth('POST', '/auth/create-api-key', getState)
      .then(response => dispatch({
        type: CREATE_API_KEY_SUCCESS,
        apiKey: response.body.token,
      }));
  };
}

export function init() {
  return dispatch => {
    getToken()
      .then(token => {
        dispatch({ type: TOKEN_READ, token });
        dispatch(fetchGuests());
        dispatch(fetchUsers());
        dispatch(fetchCannedMessages());
        dispatch(fetchAccount());
      });
  };
}
