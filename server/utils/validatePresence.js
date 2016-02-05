'use strict';

const BBPromise = require('bluebird');
const ValidationError = require('./errors').ValidationError;

module.exports = (params, requiredFields) => {
  const errors = [];
  const modelName = typeof this;

  for (const field of requiredFields) {
    if (!params[field]) {
      errors.push(`${modelName} must have ${field}.`);
    }
  }

  if (errors.length !== 0) {
    return BBPromise.reject(new ValidationError(errors));
  }

  return BBPromise.resolve(this);
};

