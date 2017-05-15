let AsyncStorage;
if (BUILD_TARGET === 'native') {
  AsyncStorage = require('react-native').AsyncStorage; // eslint-disable-line global-require
}

export function setToken(token) {
  if (BUILD_TARGET === 'browser') {
    localStorage.setItem('token', token);
  } else if (BUILD_TARGET === 'native') {
    try {
      AsyncStorage.setItem('@SD:token', token);
    } catch (e) {
      // pass
    }
  }
}

export function getToken() {
  if (BUILD_TARGET === 'browser') {
    const token = window.localStorage.getItem('token');
    return Promise.resolve(token);
  } else if (BUILD_TARGET === 'native') {
    try {
      return AsyncStorage.getItem('@SD:token');
    } catch (e) {
      // pass
    }
  }
  return Promise.resolve('');
}
