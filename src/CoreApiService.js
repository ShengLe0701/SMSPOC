import _ from 'lodash';
import express from 'express';
import jwt from 'express-jwt';
import socketIo from 'socket.io';
import socketIoJwt from 'socketio-jwt';
import * as twilio from 'twilio.js';
import winston from 'winston';
import bcrypt from 'bcrypt';
import Promise from 'promise';
import phone from 'phone';

// import ToneAnalyzerV3 from 'watson-developer-cloud/tone-analyzer/v3';
// import Watson from 'watson-developer-cloud';

import config from 'config';
import { db, requireOne } from 'db';
import queries from 'sql';
import { DBNotify, MessageDirection, Salt, SmsKeywords, SocketCommands } from 'constants.js';
import { getErrorFromPgCode } from 'errorCodes';

const sql = queries.api;
const authSql = queries.auth;

function accountRoom(accountId) {
  return `account-${accountId}`;
}

function userRoom(userId) {
  return `user-${userId}`;
}

function nullifyEmptyKeys(data, arr) {
  const localObj = _.assign({}, data);

  _.each(arr, key => {
    if (_.isEmpty(localObj[key])) localObj[key] = null;
  });

  return localObj;
}

export default class CoreApiService {
  constructor(server, reportService) {
    this.declareRoutes();
    this.initSocketIo(server);
    this.initDBNotifyListener();
    this.reportService = reportService;
  }

  getRouter() {
    return this.router;
  }

  /*
   * Private methods - don't call directly.
   */

  registerSocket(socket) {
    const userId = socket.decoded_token.id;
    const accountId = socket.decoded_token.accountId;

    socket.join(accountRoom(accountId));
    socket.join(userRoom(userId));
  }

  initDBNotifyListener() {
    db.connect({ direct: true })
      .then(sco => {
        sco.client.on('notification', data => {
          const message = JSON.parse(data.payload);
          this.io.in(accountRoom(message.accountId)).send(message);
        });

        return sco.none('LISTEN $1~', DBNotify.NEW_MESSAGE);
      })
      .catch(error => {
        winston.error('Error:', error);
      });

    db.connect({ direct: true })
      .then(sco => {
        sco.client.on('notification', data => {
          const guest = JSON.parse(data.payload);

          this.io
            .in(accountRoom(guest.accountId))
            .emit(SocketCommands.UPDATE_GUEST, guest);
        });

        return sco.none('LISTEN $1~', DBNotify.ARCHIVE_GUEST);
      })
      .catch(error => {
        winston.error('Error:', error);
      });
  }

  initSocketIo(server) {
    this.io = socketIo(server);

    this.io
      .on('connection', socket => {
        winston.debug('Socket connected', socket.id);
      })
      .on('connection', socketIoJwt.authorize({
        secret: config.JWT_SECRET,
        timeout: 15000, // 15 seconds to send the authentication message
      }))
      .on('authenticated', socket => {
        winston.debug('Socket authenticated, registering', socket.id);
        this.registerSocket(socket);

        socket.on('message', data => {
          const accountId = socket.decoded_token.accountId;
          const senderId = socket.decoded_token.id;
          const message = _.assign({
            body: null,
            uploadUrl: null,
            uploadKey: null,
            uploadName: null,
          }, data, { accountId, senderId });

          if (parseInt(message.direction, 10) === MessageDirection.TO_GUEST) {
            const guestId = message.guestId;
            let verifiedPhones;

            _.assign(message, { receiverId: null });
            sql.getPhonesByIds(db, { accountId, guestId })
              .then(requireOne)
              .then(phones => {
                verifiedPhones = phones;
                this.reportService.insertMessageToES(accountId, message);
                return sql.createMessage(db, message);
              })
              .then(requireOne)
              .then(() => twilio.sendSms(
                verifiedPhones.accountphone,
                verifiedPhones.guestphone,
                message.body || message.uploadUrl
              ))
              .catch(error => {
                socket.emit(SocketCommands.MESSAGE_ERROR, { guestId });
                winston.error(error.toString());
              });

            socket.broadcast.to(accountRoom(accountId)).send(message);
          } else {
            _.assign(message, { guestId: null });
            this.reportService.insertMessageToES(accountId, message);
            sql.createMessage(db, message)
              .then(requireOne)
              .catch(error => {
                winston.info('here');
                winston.error(error.toString());
              });

            socket.broadcast.to(userRoom(senderId)).send(message);
            this.io.in(userRoom(message.receiverId)).send(message);
          }
        });

        socket.on('disconnect', () => {
          winston.debug('Socket disconnected', socket.id);
        });

        socket.on('error', (error) => {
          winston.debug('Socket error:', error.toString());
        });
      });
  }

  notifyOfNewGuest(guest) {
    this.io
      .in(accountRoom(guest.accountId))
      .emit(SocketCommands.ADD_GUEST, guest);
  }

  updateArchivedGuest(guest) {
    const updatedGuest = _.assign({}, guest, { isArchived: false });

    if (guest.isArchived) {
      sql.updateGuest(db, updatedGuest)
        .then(requireOne)
        .then((g) => {
          this.io
            .in(accountRoom(g.accountId))
            .emit(SocketCommands.UPDATE_GUEST, g);
        })
        .catch(error => {
          winston.error(error.toString());
        });
    }
  }

  getOrCreateGuest(guestPhone, accountPhone) {
    return db.tx(tx => (
      sql.getGuestByPhones(tx, { guestPhone, accountPhone })
        .then(data => {
          if (data.length > 0) {
            this.updateArchivedGuest(data[0]);
            return data[0];
          }
          return sql.createUnverifiedGuest(tx, { guestPhone, accountPhone })
            .then(requireOne)
            .then(guest => {
              this.notifyOfNewGuest(guest);
              this.sendAutoReply(guest);
              return guest;
            });
        })
    ));
  }

  sendAutoReply(guest) {
    return sql.getAutoReply(db, guest)
      .then(data => {
        if (data.length > 0) {
          const reply = data[0];
          twilio.sendSms(reply.phoneFrom, reply.phoneTo, reply.message);

          return sql.createMessage(db, {
            guestId: guest.id,
            senderId: reply.senderId,
            receiverId: null,
            accountId: guest.accountId,
            direction: MessageDirection.TO_GUEST,
            body: reply.message,
            uploadUrl: null,
            uploadKey: null,
            uploadName: null,
          })
            .then(requireOne)
            .then(message => {
              this.io.in(accountRoom(guest.accountId)).send(message);
            });
        }
        return null;
      })
      .catch(error => {
        winston.error(error.toString());
      });
  }

  receiveSms(phoneFrom, phoneTo, body) {
    let accountId;
    let guest;
    this.getOrCreateGuest(phoneFrom, phoneTo)
      .then(g => {
        guest = g;
        accountId = guest.accountId;
        const message = {
          guestId: guest.id,
          senderId: null,
          receiverId: null,
          accountId,
          direction: MessageDirection.FROM_GUEST,
          body,
          uploadUrl: null,
          uploadKey: null,
          uploadName: null,
        };

        this.reportService.insertMessageToES(accountId, message);

        return sql.createMessage(db, message);
      })
      .then(requireOne)
      .then(message => {
        this.io.in(accountRoom(accountId)).send(message);
      })
      .then(() => {
        const keyword = body.trim().toUpperCase();
        if (SmsKeywords.STOP.has(keyword)) {
          return sql.unsubscribeGuestByPhone(db, phoneFrom)
            .then(requireOne)
            .then(g => {
              this.notifyOfNewGuest(g);
            });
        }
        if (SmsKeywords.START.has(keyword)) {
          return sql.subscribeGuestByPhone(db, phoneFrom)
            .then(requireOne)
            .then(g => {
              this.notifyOfNewGuest(g);
            });
        }
        return null;
      })
      .then(() => {
        if (guest.isVerified) {
          return null;
        }
        return sql.getRoom(db, { accountId, code: body.trim().toUpperCase() })
          .then(rooms => {
            if (rooms.length <= 0) {
              return null;
            }
            const room = rooms[0];

            // TODO(ivan): Set name based on PMS data.
            const updatedGuest = nullifyEmptyKeys(_.assign({}, guest, {
              name: `Guest at room # ${room.number}`,
              isVerified: true,
              room: room.number,
              note: `This guest was auto-verified by entering room code ${room.code}`,
            }), ['checkinAt', 'checkoutAt']);

            return sql.updateGuest(db, updatedGuest)
              .then(requireOne)
              .then(g => {
                this.notifyOfNewGuest(g);
                return null;
              });
          });
      })
      .catch(error => winston.error(error.toString()));
  }

  createGuest(data, res) {
    sql.createGuest(db, data)
      .then(requireOne)
      .then(guest => {
        this.notifyOfNewGuest(guest);
        res.send(guest);
      })
      .catch(error => {
        winston.error(error.toString());
        res.status(422).json(getErrorFromPgCode(error.code));
      });
  }

  declareRoutes() {
    this.router = new express.Router();
    this.router.use(jwt({ secret: config.JWT_SECRET }).unless({
      path: [
        '/api/forward-call',
        /\/api\/place-call/i,
        '/api/sms',
        '/api/health',
      ],
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

    this.router.get('/zapier/credential-check', (req, res) => {
      res.sendStatus(204);
    });

    this.router.post('/zapier', (req, res) => {
      winston.info('zapier [%s]', JSON.stringify(req.body));

      const defaultGuest = {
        email: '',
        room: '',
        note: '',
        checkinAt: null,
        checkoutAt: null,
      };
      const guestData = _.assign(defaultGuest, req.body,
        { accountId: req.user.accountId,
          phone: phone(req.body.phone),
          name: `${req.body.firstName} ${req.body.lastName}` });

      winston.info('GUESTDATA [%s]', JSON.stringify(guestData));
      this.createGuest(guestData, res);
    });

    this.router.post('/sms', twilio.validateSignature, (req, res) => {
      // TODO(ivan): Authenticate Twilio client.
      winston.info('received sms [%s][%s][%s]', req.body.From, req.body.To, req.body.Body);
      this.receiveSms(req.body.From, req.body.To, req.body.Body);
      res.sendStatus(204);
    });

    this.router.post('/forward-call', (req, res) => {
      winston.info('received forward-call [%s]', JSON.stringify(req.body));

      const response = ['<?xml version="1.0" encoding="UTF-8"?><Response><Dial>',
        '</Dial></Response>'];

      sql.getForwardingPhoneByPhone(db, req.body.Called)
        .then(requireOne)
        .then(account => {
          res.send([response[0], account.forwardingPhone, response[1]].join(''));
        })
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });

    this.router.post('/place-call/:userTo', (req, res) => {
      winston.info('received place-call [%s] [%s]', JSON.stringify(req.body), req.params.userTo);

      const response = [
        '<?xml version="1.0" encoding="UTF-8"?><Response><Dial><Number>',
        '</Number></Dial></Response>'];

      res.send([response[0], req.params.userTo, response[1]].join(''));
    });

    this.router.get('/guests', (req, res) => {
      sql.getGuestsByAccountId(db, req.user.accountId)
        .then(guests => res.send(guests))
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });

    this.router.post('/guests', (req, res) => {
      const data = nullifyEmptyKeys(
        _.assign({}, req.body, { accountId: req.user.accountId }),
        ['checkinAt', 'checkoutAt']);

      this.createGuest(data, res);
    });

    this.router.put('/guests/:guestId', (req, res) => {
      const guest = nullifyEmptyKeys(_.assign({}, req.body, {
        id: req.params.guestId,
        accountId: req.user.accountId,
      }), ['checkinAt', 'checkoutAt']);

      sql.updateGuest(db, guest)
        .then(requireOne)
        .then(result => {
          this.notifyOfNewGuest(result);
          res.send(result);
        })
        .catch(error => {
          winston.error(error.toString());
          res.status(422).json(getErrorFromPgCode(error.code));
        });
    });

    this.router.post('/guests/call', (req, res) => {
      const url = [config.BASE_URL, '/api/place-call/', req.body.userTo].join('');

      twilio.placeCall(req.body.from, req.body.to, url)
        .then(() => res.sendStatus(204))
        .catch(error => {
          res.status(500).send(JSON.stringify(error));
        });

      winston.info('req.body', req.body);
    });

    this.router.get('/guests/:guestId/messages', (req, res) => {
      sql.getMessagesByGuestId(db, {
        accountId: req.user.accountId,
        guestId: req.params.guestId,
      })
        .then(messages => res.send(messages))
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });

    this.router.get('/users/:userId/messages', (req, res) => {
      sql.getMessagesByUserIds(db, {
        id1: req.user.id,
        id2: req.params.userId,
      })
        .then(messages => res.send(messages))
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });

    this.router.get('/users', (req, res) => {
      sql.getUsersByAccountId(db, req.user.accountId)
        .then(users => res.send(users))
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });

    this.router.get('/canned-messages', (req, res) => {
      sql.getCannedMessagesByAccountId(db, req.user.accountId)
        .then(cannedMessages => res.send(cannedMessages))
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });

    this.router.put('/canned-messages/:cannedMessageId', (req, res) => {
      const data = _.assign({}, req.body, {
        id: req.params.cannedMessageId,
        accountId: req.user.accountId,
      });

      sql.updateCannedMessage(db, data)
        .then(requireOne)
        .then(cannedMessage => res.send(cannedMessage))
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });

    this.router.post('/canned-messages', (req, res) => {
      const data = _.assign({}, req.body, {
        accountId: req.user.accountId,
        userId: req.user.id,
      });

      sql.createCannedMessage(db, data)
        .then(requireOne)
        .then(cannedMessage => res.send(cannedMessage))
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });

    this.router.delete('/canned-messages/:cannedMessageId', (req, res) => {
      const data = {
        accountId: req.user.accountId,
        id: req.params.cannedMessageId,
      };

      sql.deleteCannedMessage(db, data)
        .then(() => res.send({ id: req.params.cannedMessageId }))
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });

    // TODO(ivan): Move users and password-related stuff to AuthenticationService.
    this.router.put('/users/:userId', (req, res) => {
      const hasher = Promise.denodeify(bcrypt.hash);
      const data = nullifyEmptyKeys(_.assign({}, req.body, {
        id: req.params.userId,
        accountId: req.user.accountId,
      }), ['phone']);

      if (_.has(req.body, 'password')) {
        hasher(req.body.password, Salt.ROUNDS)
          .then(hash => sql.updateUserWithPassword(db, _.assign({},
            data,
            { password: hash }))
          .then(user => {
            winston.info('User updated', user);
            return user;
          })
          .catch(error => {
            winston.error(error);
          })
        )
        .then(user => {
          res.send(user);
        })
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
      } else {
        sql.updateUserWithoutPassword(db, data)
          .then(requireOne)
          .then(user => res.send(user))
          .catch(error => {
            winston.error(error.toString());
            res.sendStatus(500);
          });
      }
    });

    this.router.post('/users', (req, res) => {
      const hasher = Promise.denodeify(bcrypt.hash);
      const data = nullifyEmptyKeys(
        _.assign({}, req.body, { accountId: req.user.accountId }),
        ['phone']);

      hasher(req.body.password, Salt.ROUNDS)
        .then(hash => authSql.createUser(db, _.assign({},
          data, { password: hash }))
          .then(user => {
            winston.info('User created', user);
            return user;
          })
          .catch(error => {
            winston.error(error);
          })
        )
        .then(requireOne)
        .then(user => {
          res.send(user);
        })
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });

    this.router.get('/accounts', (req, res) => {
      sql.getAccountById(db, req.user.accountId)
        .then(account => res.send(account))
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });

    this.router.put('/accounts/:id', (req, res) => {
      if (_.parseInt(req.params.id) !== _.parseInt(req.user.accountId)) {
        res.status(401).json({ error: 'Accounts do not match' });
      }
      const data = _.assign({}, nullifyEmptyKeys(req.body, ['apiKey', 'forwardingPhone']), {
        id: req.user.accountId,
      });

      sql.updateAccounts(db, data)
        .then(requireOne)
        .then(account => res.send(account))
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });
  }
}
