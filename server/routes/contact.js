'use strict';

require('dotenv').load();

const express = require('express');
const router = express.Router();
const Mailer = require('../utils/mailer');
const Message = require('../models/message');
const ValidationError = require('../utils/errors').ValidationError;

router.post('/', (req, res, next) => {
  const message = new Message(req.body.data);
  const mailer = new Mailer(message);

  message.validate()
    .then(() => mailer.send())
    .then(() => res.status(201).json({ data: { status: 'mailed' } }))
    .catch(ValidationError, err => res.status(422).json({ errors: err.messages }))
    .catch(err => next(err));
});

module.exports = router;
