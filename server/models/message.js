'use strict';

const BBPromise = require('bluebird');
const ValidationError = require('../utils/errors').ValidationError;
const requiredFields = [
  'firstName',
  'lastName',
  'message'
];

class Message {
  constructor(messageParams) {
    this._messageParams = messageParams;
  }

  validate() {
    const errors = [];

    for (const field of requiredFields) {
      if (!this._messageParams[field]) {
        errors.push(`Message must have ${field}.`);
      }
    }
    if (errors.length !== 0) {
      return BBPromise.reject(new ValidationError(errors));
    }

    return BBPromise.resolve(this);
  }

  formatted() {
    return `
From ${this._messageParams.firstName} ${this._messageParams.lastName}
${this._messageParams.jobTitle} ${this._messageParams.company}

Message:
${this._messageParams.message}
      `.trim();
  }
}

module.exports = Message;
