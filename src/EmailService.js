import express from 'express';
import winston from 'winston';
import sendgrid from 'sendgrid';

import config from 'config';

const helper = sendgrid.mail;
const sg = sendgrid(config.SENDGRID_API_KEY);


export default class EmailService {
  constructor() {
    this.declareRoutes();
  }

  getRouter() {
    return this.router;
  }

  declareRoutes() {
    this.router = new express.Router();

    this.router.get('/health', (req, res) => {
      res.sendStatus(204);
    });

    this.router.post('/waitlist', (req, res) => {
      const fromEmail = new helper.Email('j@staydelightful.com');
      const toEmail = new helper.Email('j@staydelightful.com');
      const subject = 'Waitlist sign up';
      const content = new helper.Content('text/plain', JSON.stringify(req.body));
      const mail = new helper.Mail(fromEmail, subject, toEmail, content);

      const request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
      });

      sg.API(request, (error, response) => {
        winston.info(response.statusCode);
        winston.info(response.body);
        winston.info(response.headers);
        res.sendStatus(204);
      });
    });
  }

}
