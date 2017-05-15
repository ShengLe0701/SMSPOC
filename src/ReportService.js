import _ from 'lodash';
import express from 'express';
import jwt from 'express-jwt';
import winston from 'winston';
import elasticsearch from 'elasticsearch';
import md5 from 'md5';

import * as ESConfig from 'elasticSearchConfig';
import config from 'config';
import { db, requireOne } from 'db';
import queries from 'sql';

const sql = queries.api;

export default class ReportService {
  constructor() {
    this.declareRoutes();
  }

  getRouter() {
    return this.router;
  }

  findOrCreateESIndex(acctId) {
    const client = new elasticsearch.Client({
      host: config.ES_URL,
      log: 'trace',
    });

    return sql.getAccountById(db, acctId)
      .then(requireOne)
      .then(acct => {
        const indexName = md5(acct.phone);

        return client.indices.exists({ index: indexName }).
          then(isCreated => {
            if (!isCreated) {
              client.indices.create({
                index: indexName,
                body: {
                  settings: ESConfig.settings(),
                  mappings: ESConfig.mappings(),
                },
              });
            }
            return indexName;
          });
      })
      .catch(error => {
        winston.error(error.toString());
      });
  }

  insertMessageToES(acctId, message) {
    const client = new elasticsearch.Client({
      host: config.ES_URL,
      log: 'trace',
    });

    if (config.APP_ELASTICSEARCH) {
      this.findOrCreateESIndex(acctId)
        .then(indexName => {
          client.index({
            index: indexName,
            body: message,
            type: config.ES_TYPE,
          }, (err) => {
            winston.info(`Elasticsearch error ${err}`);
          });
        });
    }
  }


  /*
   * Private methods - don't call directly.
   */

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
      const client = new elasticsearch.Client({
        host: config.ES_URL,
        log: 'trace',
      });

      const agg = {
        size: 0,
        aggregations: {
          the_messages: {
            terms: {
              field: 'body',
            },
          },
        },
      };

      sql.getAccountById(db, req.user.accountId).
        then(requireOne).
        then(acct => {
          const indexName = md5(acct.phone);
          client.search({
            index: indexName,
            type: config.ES_TYPE,
            body: agg,
          })
          .then((resp) => {
            const data = _.map(resp.aggregations.the_messages.buckets,
              bucket => [bucket.key, bucket.doc_count]
            );

            res.send(data);
          })
          .catch(error => {
            winston.error(error.toString());
            res.sendStatus(500);
          });
        })
        .catch(error => {
          winston.error(error.toString());
          res.sendStatus(500);
        });
    });
  }
}
