'use strict';

require('dotenv').load();

const express = require('express');
const router = express.Router();
const apiKey = process.env.MAILGUN_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({ apiKey, domain });

router.post('/', (req, res, next) => {
  const mailData = {
    from: process.env.MAILGUN_FROM,
    to: 'joe@smashingboxes.com',
    subject: 'Contact Form Submitted',
    text: JSON.stringify(req.body.data)
  };

  mailgun.messages().send(mailData)
    .then(() => res.status(201).json({ data: { status: 'mailed' } }))
    .catch(err => next(err));
});

module.exports = router;
