import _ from 'lodash';
import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import winston from 'winston';
import React from 'react';
import { renderToString } from 'react-dom/server';
import * as router from 'react-router';
import * as history from 'history';

// import routes from 'isomorphicRoutes';
import routes from 'routes';
import config from 'config';
import configDefaults from 'configDefaults';
import AuthenticationService from 'AuthenticationService';
import CoreApiService from 'CoreApiService';
import UploadService from 'UploadService';
import EmailService from 'EmailService';
import ReportService from 'ReportService';
import ScheduledJobsService from 'ScheduledJobsService';
import PaymentService from 'PaymentService';

winston.level = config.LOG_LEVEL;

const app = express();
const server = http.Server(app);
const reportService = new ReportService();
app.use(express.static('public'));
app.use(express.static('out/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', new AuthenticationService().getRouter());
app.use('/api', new CoreApiService(server, reportService).getRouter());
app.use('/uploads', new UploadService().getRouter());
app.use('/email', new EmailService().getRouter());
if (config.APP_PAYMENTS === 'true') {
  app.use('/payments', new PaymentService().getRouter());
}
app.use('/reports', reportService.getRouter());
app.use('/api/scheduled-jobs', new ScheduledJobsService().getRouter());

app.get('/config.js', (req, res) => {
  const clientConfig = _.pick(config, configDefaults.clientConfigKeys);
  res
    .type('js')
    .set('Cache-Control', 'no-cache')
    .send(`
      window.STAYDELIGHTFUL_CONFIG = ${JSON.stringify(clientConfig)};
    `);
});

function wrap(content) {
  return (`
    <!DOCTYPE html>
    <html lang="en"><head>
      <title>Stay Delightful</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <link rel="shortcut icon" type="image/png" href="/images/favicon.png"/>
      <link href="/css/style.css" rel="stylesheet" type="text/css">
    </head><body>
      <div id="app">${content}</div>
      <script type="text/javascript" src="/config.js"></script>
      <script type="text/javascript" src="/js/app.js"></script>
    </body></html>
  `);
}

// Don't pre-render app UI.
app.get('/app*', (req, res) => {
  res.send(wrap(''));
});

app.use('/', (req, res) => {
  const location = history.createLocation(req.path);

  router.match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search, '/');
    } else if (renderProps) {
      const markup = renderToString(<router.RouterContext {...renderProps} />);
      res.send(wrap(markup));
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.use(express.static('public'));

server.listen(config.PORT);
