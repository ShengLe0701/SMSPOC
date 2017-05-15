import _ from 'lodash';
import defaults from 'configDefaults';

export default _.defaults(
  _.pick(process.env, _.keys(defaults.nodeConfig)), // eslint-disable-line no-process-env
  defaults.nodeConfig
);
