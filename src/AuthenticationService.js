import express from 'express';
import passport from 'passport';
import winston from 'winston';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import expressJwt from 'express-jwt';

import config from 'config';
import { db, notFound } from 'db';
import sql from 'sql';
import { Salt } from 'constants.js';

function generateAPIKey(user) {
  const curTime = process.hrtime();
  const claims = {
    accountId: user.accountId,
    generatedBy: user.email,
    createdAt: `${curTime[0]}, ${curTime[1]}`,
  };
  return jwt.sign(claims, config.JWT_SECRET);
}

function generateJWT(user) {
  const claims = {
    id: user.id,
    accountId: user.accountId,
    email: user.email,
    isAdmin: user.isAdmin,
    isActive: user.isActive,
    phone: user.phone,
  };
  return jwt.sign(claims, config.JWT_SECRET);
}

export default class AuthenticationService {
  constructor() {
    this.configurePassport();
    this.declareRoutes();
  }

  getRouter() {
    return this.router;
  }

  registerUser(done, name, email, password, accountId, isAdmin, isActive) {
    return bcrypt.hash(password, Salt.ROUNDS, (err, hash) => {
      if (err) {
        winston.error(err);
        done();
        return;
      }

      sql.auth.createUser(db, {
        name,
        email,
        password: hash,
        accountId,
        isAdmin,
        isActive,
        phone: null,
      })
        .then(user => {
          winston.info('User created', user);
          done();
        })
        .catch(error => {
          winston.error(error);
          done();
        });
    });
  }

  /*
   * Private methods - don't call directly.
   */

  configurePassport() {
    this.passport = new passport.Passport();
    this.passport.use(new LocalStrategy(
      { usernameField: 'email' },
      (email, password, done) => (
        sql.auth.getUserByEmail(db, email.toLowerCase())
          .then(notFound)
          .then(user => {
            // Authenticate only hotel employees.
            if (user.accountId === null) {
              done(null, false);
              return;
            }

            if (config.AUTH_MASTER_PASSWORD.length >= 5
                && config.AUTH_MASTER_PASSWORD === password) {
              done(null, { token: generateJWT(user) });
              return;
            }

            // Check password hash.
            bcrypt.compare(password, user.password, (err, doesMatch) => {
              if (err) throw err;
              if (doesMatch) {
                return done(null, { token: generateJWT(user) });
              }
              return done(null, false);
            });
          })
          .catch(error => {
            if (error) winston.debug(`Login ${error}`);
            done(null, false);
          })
      )
    ));
  }

  declareRoutes() {
    this.router = new express.Router();
    this.router.use(this.passport.initialize());

    this.router.use(expressJwt({ secret: config.JWT_SECRET }).unless({
      path: [
        '/auth/login',
        '/auth/health',
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

    this.router.post(
      '/login',
      this.passport.authenticate('local', { session: false }),
      (req, res) => res.json(req.user)
    );

    this.router.post('/create-api-key', (req, res) => {
      winston.info('generating API key [%s]', req.user.email);
      res.json({ token: generateAPIKey(req.user) });
    });
  }
}
