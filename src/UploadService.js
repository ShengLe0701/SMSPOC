import aws from 'aws-sdk';
import crypto from 'crypto';
import base64url from 'base64url';
import Busboy from 'busboy';
import express from 'express';
import jwt from 'express-jwt';
import createS3Stream from 's3-upload-stream';
import winston from 'winston';

import config from 'config';

class KeyGenerationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'KeyGenerationError';
    this.message = message || '';
  }
}

export default class UploadService {
  constructor() {
    this.declareRoutes();
    this.initS3();
  }

  getRouter() {
    return this.router;
  }

  initS3() {
    this.s3 = new aws.S3({
      accessKeyId: config.UPLOAD_AWS_ACCESS_KEY_ID,
      secretAccessKey: config.UPLOAD_AWS_SECRET_ACCESS_KEY,
    });

    this.s3Stream = createS3Stream(this.s3);
  }

  // Handle uploading file to Amazon S3.
  // Uses the multipart file upload API.
  uploadToS3(readStream, key, contentType, callback) {
    const upload = this.s3Stream.upload({
      Bucket: config.UPLOAD_AWS_S3_BUCKET,
      Key: key,
      ACL: 'public-read',
      ContentType: contentType,
    });

    // Handle errors.
    upload.on('error', err => {
      callback(err);
    });

    // Handle upload completion.
    upload.on('uploaded', () => {
      callback();
    });

    // Pipe the Readable stream to the s3-upload-stream module.
    readStream.pipe(upload);
  }

  declareRoutes() {
    this.router = new express.Router();
    this.router.use(jwt({ secret: config.JWT_SECRET }).unless({
      path: '/uploads/health',
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

    this.router.post('/files', (req, res) => {
      this.getRandomKey((key, err) => {
        if (err) {
          winston.error(err);
          res.status(500).json({ error: 'Unable to generate key' });
        } else {
          let busboy;
          try {
            busboy = new Busboy({ headers: req.headers });
          } catch (e) {
            winston.error(e);
            res.status(400).json({ error: e.message });
            return;
          }

          let foundFile = false;
          busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            foundFile = true;
            // Handle uploading file to Amazon S3.
            // We are passing 'file' which is a ReadableStream,
            // 'filename' which is the name of the file
            // and a callback function to handle success/error.
            this.uploadToS3(file, `${key}/${filename}`, mimetype, s3err => {
              if (s3err) {
                winston.error(s3err);
                res.status(500).json({ error: 'Unable to upload' });
              } else {
                res.json({
                  key,
                  name: filename,
                  url: `${config.UPLOAD_CDN_URL}/${key}/${filename}`,
                });
              }
            });
          });

          busboy.on('finish', () => {
            if (!foundFile) {
              res.status(400).json({ error: 'Didn\'t receive a file' });
            }
          });

          // Pipe the HTTP Request into Busboy.
          req.pipe(busboy);
        }
      });
    });
  }

  getRandomKey(callback) {
    let i = 0;

    const iterate = () => {
      const buf = crypto.randomBytes(parseInt(config.UPLOAD_KEY_LENGTH, 10));
      const key = base64url(buf);

      this.s3.headObject({
        Bucket: config.UPLOAD_AWS_S3_BUCKET,
        Key: key,
      }, err => {
        if (err && err.code === 'NotFound') {
          callback(key, null);
        } else if (i < config.UPLOAD_KEY_GENERATION_ATTEMPTS) {
          i++;
          iterate();
        } else {
          callback(null, new KeyGenerationError('Reached the limit of attempts'));
        }
      });
    };

    iterate();
  }
}
