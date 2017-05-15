import _ from 'lodash';
import pg from 'pg';
import winston from 'winston';

import AuthenticationService from 'AuthenticationService';
import ScheduledJobsService from 'ScheduledJobsService';

const commands = {
  'add-hotel-employee': (done, args) => {
    new AuthenticationService().registerUser(done, ... args);
  },
  'job-runner': (done, args) => {
    new ScheduledJobsService().runJobs(done, ...args);
  },
};

function finalize() {
  pg.end();
}

function main() {
  if (!commands[process.argv[2]]) {
    winston.info('Please specify one of the following commands:');
    _.forEach(commands, (f, commandName) => {
      winston.info(`npm run oneoff ${commandName}`);
    });

    return;
  }

  commands[process.argv[2]](finalize, _.drop(process.argv, 3));
}

if (!module.parent) {
  main();
}
