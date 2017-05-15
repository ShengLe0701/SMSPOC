/* eslint-disable */
const _ = require('lodash');

function ensureStrings(object) {
  _.each(object, function (value) {
    if (typeof(value) !== 'string') {
      throw 'Config values must be strings';
    }
  });
}

const nodeConfig = {
  PORT: '3000',
  BASE_URL: 'http://localhost:3000',
  DATABASE_URL: '',
  LOG_LEVEL: 'debug',

  // Auth service.
  AUTH_MASTER_PASSWORD: '',
  JWT_SECRET: '',

  // Payment service.
  STRIPE_SECRET_KEY: '',
  STRIPE_PUBLISHABLE_KEY: '',
  STRIPE_WEBHOOK_KEY: '',

  // Sendgrid.
  SENDGRID_API_KEY: '',

  // Twilio.
  TWILIO_ACCOUNT_SID: '',
  TWILIO_AUTH_TOKEN: '',
  TWILIO_REQUEST_URL: '',
  TWILIO_VALIDATE_SIGNATURE: 'true',

  // UploadService.
  UPLOAD_KEY_GENERATION_ATTEMPTS: '10',
  UPLOAD_KEY_LENGTH: '64',
  UPLOAD_CDN_URL: 'https://sd-development-uploads.s3-us-west-2.amazonaws.com',
  UPLOAD_AWS_S3_BUCKET: 'sd-development-uploads',
  UPLOAD_AWS_ACCESS_KEY_ID: '',
  UPLOAD_AWS_SECRET_ACCESS_KEY: '',

  // IBM Watson
  IBM_WATSON_USERNAME: '',
  IBM_WATSON_PASSWORD: '',
  IBM_WATSON_ALCHEMY_API_KEY: '',

  // Elasticsearch
  ES_URL: 'http://localhost:9200',
  ES_TYPE: 'message',
  ES_MAPPING: '',

  // feature flags
  APP_REPORTS: 'true',
  APP_PAYMENTS: 'true',
  APP_ELASTICSEARCH: 'false',
};
ensureStrings(nodeConfig);

const clientConfigKeys = [
  'BASE_URL',
  'APP_REPORTS',
  'APP_PAYMENTS',
  'STRIPE_PUBLISHABLE_KEY',
];
ensureStrings(clientConfigKeys);

const nativeDefaults = {
  BASE_URL: 'https://staydelightful.com',
};
ensureStrings(nativeDefaults);

const nativeConfig = _.defaults(
  _.pick(process.env, clientConfigKeys),
  nativeDefaults,
  _.pick(nodeConfig, clientConfigKeys)
);

module.exports = {
  nodeConfig,
  clientConfigKeys,
  nativeConfig,
};
