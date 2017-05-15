export const UPDATE_PAYMENT_REQUEST = 'payment.UPDATE_PAYMENT_REQUEST';
export const UPDATE_PAYMENT_SUCCESS = 'payment.UPDATE_PAYMENT_SUCCESS';
export const UPDATE_PAYMENT_FAILURE = 'payment.UPDATE_PAYMENT_FAILURE';

import { auth } from 'actions/utils';

export function fetchPayment() {
  return (dispatch, getState) => {
    dispatch({ type: UPDATE_PAYMENT_REQUEST });
    auth('GET', '/payments/payment', getState)
      .then(response => response.body)
      .then(payment => dispatch({ type: UPDATE_PAYMENT_SUCCESS, payment }))
      .catch(error => dispatch({ type: UPDATE_PAYMENT_FAILURE, error }));
  };
}

export function subscribe(paymentToken) {
  return (dispatch, getState) => {
    dispatch({ type: UPDATE_PAYMENT_REQUEST });
    auth('POST', '/payments/subscribe', getState)
      .type('json')
      .send(paymentToken)
      .then(response => response.body)
      .then(payment => dispatch({ type: UPDATE_PAYMENT_SUCCESS, payment }))
      .catch(error => dispatch({ type: UPDATE_PAYMENT_FAILURE, error }));
  };
}
