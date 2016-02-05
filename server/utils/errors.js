'use strict';

class ValidationError extends Error {
  constructor(messages) {
    super('Validation Error');
    this.messages = messages;
  }
}

module.exports = { ValidationError };
