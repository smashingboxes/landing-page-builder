'use strict';

const validatePresence = require('../utils/validatePresence');
const requiredFields = [
  'firstName',
  'lastName',
  'email'
];

class Application {
  constructor(applicationParams) {
    this._applicationParams = applicationParams;
    this.validate = validatePresence
      .bind(this, this._applicationParams, requiredFields);
  }

  toCandidate() {
    return {
      firstname: this._applicationParams.firstName,
      lastname: this._applicationParams.lastName,
      email: this._applicationParams.email,
      summary: this._formattedMessage(this._applicationParams),
      resume: {
        name: this._applicationParams.resumeName,
        data: this._applicationParams.resume
      }
    };
  }

  _formattedMessage(application) {
    let socialMedia = '';
    if (application.linkedIn !== undefined) {
      socialMedia = socialMedia + `\nLinkedIn: ${application.linkedIn}`;
    }

    if (application.personalWebsite !== undefined) {
      socialMedia = socialMedia + `\nWebsite: ${application.personalWebsite}`;
    }

    if (application.socialMedia !== undefined ) {
      for (const other of application.socialMedia) {
        socialMedia = socialMedia + `\n${other}`;
      }
    }

    if (socialMedia !== '') {
      socialMedia = '\n' + socialMedia;
    }

    return `${application.message}${socialMedia}`;
  }
}

module.exports = Application;
