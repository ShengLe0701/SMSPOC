import _ from 'lodash';
import preql from 'preql';

function camelize(string) {
  return string.replace(/_\w/g, match => match[1].toUpperCase());
}

function camelizeKeys(object) {
  return _.mapKeys(object, (value, key) => camelize(key));
}

function deepMapValues(arg, f) {
  if (_.isFunction(arg)) {
    return f(arg);
  }
  return _.mapValues(arg, value => deepMapValues(value, f));
}

const queries = preql.makeQueries('./queries');
export default deepMapValues(queries, f => (
  _.flow([
    _.overArgs(f, client => client.query.bind(client)),
    promise => promise.then(list => _.map(list, camelizeKeys)),
  ])
));
