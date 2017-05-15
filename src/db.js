import pgp from 'pg-promise';

import config from 'config';

export const db = pgp()(config.DATABASE_URL);

export class DatabaseRequireError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseRequireError';
    this.message = message || '';
  }
}

export class NotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFound';
    this.message = message || '';
  }
}

export function requireOne(data) {
  if (data.length !== 1) {
    throw new DatabaseRequireError(`Expected array of 1 element, found: ${data}`);
  }
  return data[0];
}

export function notFound(data) {
  if (data.length === 0) {
    throw new NotFound('No matching rows found');
  }
  return data[0];
}
