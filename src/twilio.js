import phone from 'phone';
import twilio from 'twilio';
import winston from 'winston';

import config from 'config';

const client = new twilio.RestClient(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

export class CallError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CallError';
    this.message = message || '';
  }
}

export class MessageDeliveryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MessageDeliveryError';
    this.message = message || '';
  }
}

export function placeCall(phoneFrom, phoneTo, url) {
  return client.makeCall({
    url,
    to: phoneTo,
    from: phoneFrom,
  }).catch(err => {
    winston.debug('Twilio response:', err);
    throw new CallError(err);
  });
}

export function sendSms(phoneFrom, phoneTo, body) {
  winston.info('to: [%s], ', phoneTo);
  winston.info('message.body: [%s], ', body);
  return client.sendMessage({
    to: phone(phoneTo),
    from: phone(phoneFrom),
    body,
  }).catch(err => {
    winston.debug('Twilio response:', err);
    throw new MessageDeliveryError(err);
  });
}

export function validateSignature(req, res, next) {
  if (config.TWILIO_VALIDATE_SIGNATURE === 'false') {
    next();
    return;
  }

  if (twilio.validateRequest(
    config.TWILIO_AUTH_TOKEN,
    req.headers['x-twilio-signature'],
    config.TWILIO_REQUEST_URL,
    req.body
  )) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid signature' });
  }
}
