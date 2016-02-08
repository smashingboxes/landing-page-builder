'use strict';

const fs = require('fs');
const ejs = require('ejs');
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
    const messageTemplate = fs.readFileSync(
      './server/templates/contact_message.ejs'
    ).toString();
    return ejs.render(messageTemplate, this._messageParams);
  }
}

module.exports = Message;
