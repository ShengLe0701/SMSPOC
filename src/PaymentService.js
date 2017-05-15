import _ from 'lodash';
import express from 'express';
import jwt from 'express-jwt';
import Stripe from 'stripe';
import winston from 'winston';

import config from 'config';
import { db, requireOne } from 'db';
import sql from 'sql';

const stripe = Stripe(config.STRIPE_SECRET_KEY);

export default class PaymentService {
  constructor() {
    this.declareRoutes();
  }

  getRouter() {
    return this.router;
  }

  declareRoutes() {
    this.router = new express.Router();
    this.router.use(jwt({ secret: config.JWT_SECRET }).unless({
      path: ['/payments/health', new RegExp('/payments/webhook/.*')],
    }));

    this.router.get('/health', (req, res) => {
      res.sendStatus(204);
    });

    this.router.use((err, req, res, next) => {
      if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Invalid token' });
      } else {
        next();
      }
    });

    this.router.get('/payment', (req, res) => {
      sql.payments.getSubscription(db, req.user.accountId)
        .then(data => {
          if (data.length === 0) {
            res.send({});
            return null;
          }
          return this.enrichSubscription(data[0])
            .then(sub => {
              res.send(sub);
            });
        })
        .catch(error => {
          winston.error('Error fetching subscription:', error);
          res.sendStatus(500);
        });
    });

    this.router.post('/subscribe', (req, res) => {
      sql.payments.getSubscription(db, req.user.accountId)
        .then(data => {
          if (data.length === 0) {
            // No subscription/plan record means the account is on free trial.
            res.sendStatus(400);
            return null;
          }

          const subscription = data[0];
          if (subscription.stripeCustomerId) {
            return this.updatePaymentDetails(subscription.stripeCustomerId, req.body)
              .then(this.enrichSubscription)
              .then(sub => {
                res.send(sub);
                return null;
              });
          }

          return this.createPaymentDetails(req.user, subscription.stripePlanId, req.body)
            .then(this.enrichSubscription)
            .then(sub => {
              res.send(sub);
              return null;
            });
        })
        .catch(error => {
          if (error.rawType === 'card_error') {
            res.status(400).send(error.raw);
          } else {
            winston.error('Error updating subscription:', error);
            res.sendStatus(500);
          }
        });
    });

    this.router.post(`/webhook/${config.STRIPE_WEBHOOK_KEY}`, (req, res) => {
      if (!req.body.id) {
        res.sendStatus(400);
        return;
      }

      stripe.events.retrieve(req.body.id)
        .then(event => {
          switch (event.type) {
            case 'invoice.payment_failed':
              return this.handlePaymentFailed(event.data.object.customer);
            case 'invoice.payment_succeeded':
              return this.handlePaymentSucceeded(event.data.object.customer);
            default:
              // Accept and ignore other events.
              return null;
          }
        })
        .then(() => res.sendStatus(204))
        .catch(error => {
          winston.error('Stripe webhook error:', error);
          res.sendStatus(500);
        });
    });
  }

  enrichSubscription(subscription) {
    return stripe.plans.retrieve(subscription.stripePlanId)
      .then(plan => _.assign({}, subscription, {
        plan: _.pick(plan, ['amount', 'currency', 'interval']),
      }));
  }

  updatePaymentDetails(stripeCustomerId, token) {
    return stripe.customers
      .update(stripeCustomerId, { source: token.id })
      .then(() => sql.payments.updatePaymentDetails(db, {
        stripeCustomerId,
        stripeCardBrand: token.card.brand,
        stripeCardDigits: token.card.last4,
      }))
      .then(requireOne);
  }

  createPaymentDetails(user, planId, token) {
    return stripe.customers
      .create({
        email: user.email,
        source: token.id,
      })
      .then(customer => (
        stripe.subscriptions
          .create({
            customer: customer.id,
            plan: planId,
          })
          .then(sub => (
            sql.payments.createPaymentDetails(db, {
              accountId: user.accountId,
              stripeCustomerId: customer.id,
              stripeSubscriptionId: sub.id,
              stripeCardBrand: token.card.brand,
              stripeCardDigits: token.card.last4,
            })
          ))
      ))
      .then(requireOne);
  }

  handlePaymentFailed(/* stripeCustomerId */) {
    // TODO(ivan): Notify account admins.
    return null;
  }

  handlePaymentSucceeded(stripeCustomerId) {
    return sql.payments
      .extendSubscription(db, stripeCustomerId)
      .then(() => {
        winston.debug('Subscription extended for customer', stripeCustomerId);
      });
  }
}
