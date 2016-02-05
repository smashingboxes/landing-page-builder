'use strict';

const validatePresence = require('../utils/validatePresence');
const requiredFields = [
  'firstName',
  'lastName',
  'message'
];

class Message {
  constructor(messageParams) {
    this._messageParams = messageParams;
    this.validate = validatePresence
      .bind(this, this._messageParams, requiredFields);
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
