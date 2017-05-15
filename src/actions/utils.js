import superagent from 'superagent';

import config from 'config';

export function request(method, url) {
console.log(config.BASE_URL)
  return superagent(method, `${config.BASE_URL}${url}`);
}

export function auth(method, url, getState) {
  const token = getState().getIn(['auth', 'token']);
  return request(method, url).set('Authorization', `Bearer ${token}`);
}
