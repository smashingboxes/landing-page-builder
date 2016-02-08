'use strict';

class ValidationError extends Error {
  constructor(messages) {
    super('Validation Error');
    this.messages = messages;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

class CacheMissError extends Error { }

module.exports = { ValidationError, NotFoundError, CacheMissError };
