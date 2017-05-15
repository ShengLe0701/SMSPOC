import _ from 'lodash';
import express from 'express';
import jwt from 'express-jwt';
import winston from 'winston';

import * as twilio from 'twilio.js';
import config from 'config';
import { db, requireOne } from 'db';
import queries from 'sql';
import { DBNotify, JobType, MessageDirection } from 'constants.js';

const sql = queries.api;

export default class ScheduleService {
  constructor() {
    this.declareRoutes();
  }

  getRouter() {
    return this.router;
  }

  runJobs(done) {
    this.processArchiveGuests(done);
    this.processSMSJobs(done);
  }

  /*
   * Private methods - don't call directly.
   */

  processArchiveGuests(done) {
    sql.getArchiveableGuests(db)
      .then(guests => {
        _.each(guests, guest => {
          const updatedGuest = _.assign({}, guest, { isArchived: true });

          sql.updateGuest(db, updatedGuest)
            .then(requireOne)
            .then(g => {
              const payloadStr = JSON.stringify(g);
              db.none('NOTIFY $1~, $2', [DBNotify.ARCHIVE_GUEST, payloadStr])
                .then(() => {
                  winston.info('Notification sent.', payloadStr);
                })
                .catch(error => {
                  winston.error('NOTIFY error:', error);
                });
              done();
            });
        });
        done();
      });

    done();
  }

  processSMSJobs(done) {
    sql.getJobs(db, { type: JobType.SMS })
      .then(jobs => {
        _.each(jobs, (job, index) => {
          setTimeout(() => {
            twilio.sendSms(
              job.payload.from,
              job.payload.to,
              job.payload.body
            );

            sql.deleteJob(db, job)
              .then(() => {
                winston.info('Job Deleted', job.id);
                done();
              })
              .catch(error => {
                winston.error(error);
                done();
              });

            sql.createMessage(db, {
              guestId: job.payload.guestId,
              senderId: job.payload.senderId,
              receiverId: null,
              accountId: job.payload.accountId,
              direction: MessageDirection.TO_GUEST,
              body: job.payload.body,
              uploadUrl: null,
              uploadKey: null,
              uploadName: null,
            })
              .then(requireOne)
              .then(message => {
                const payloadStr = JSON.stringify(message);
                db.none('NOTIFY $1~, $2', [DBNotify.NEW_MESSAGE, payloadStr])
                  .then(() => {
                    winston.info('Notification sent.', payloadStr);
                  })
                  .catch(error => {
                    winston.error('NOTIFY error:', error);
                  });
                done();
              });
          }, index * 1500);
        });
        done();
      })
      .catch(error => {
        winston.error(error);
        done();
      });

    done();
  }

  declareRoutes() {
    this.router = new express.Router();
    this.router.use(jwt({ secret: config.JWT_SECRET }).unless({
      path: ['/reports/health'],
    }));

    this.router.use((err, req, res, next) => {
      if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Invalid token' });
      } else {
        next();
      }
    });

    this.router.get('/health', (req, res) => {
      res.sendStatus(204);
    });

    this.router.get('/', (req, res) => {
      sql.getScheduledJobsByAccountId(db, req.user.accountId)
        .then(scheduledJobs => res.send(scheduledJobs))
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });

    this.router.post('/', (req, res) => {
      const data = _.assign({}, req.body, {
        accountId: req.user.accountId,
        userId: req.user.id,
      });

      _.merge(data, { payload: {
        senderId: req.user.id,
        accountId: req.user.accountId,
      } });

      sql.createScheduledJob(db, data)
        .then(requireOne)
        .then(scheduledJob => res.send(scheduledJob))
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });

    this.router.delete('/:id', (req, res) => {
      const data = {
        accountId: req.user.accountId,
        id: req.params.id,
      };

      sql.deleteScheduledJob(db, data)
        .then(() => res.send({ id: req.params.id }))
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });
  }
}

