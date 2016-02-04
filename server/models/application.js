'use strict';

const requiredFields = [
  'firstName',
  'lastName',
  'email'
];

class Application {
  constructor(applicationData) {
    this._applicationData = applicationData;
    this.errors = [];
  }

  isValid() {
    for (const field of requiredFields) {
      if (!this._applicationData[field]) {
        this.errors.push(`Application must have ${field}.`);
      }
    }

    return this.errors.length === 0;
  }

  toCandidate() {
    return {
      firstname: this._applicationData.firstName,
      lastname: this._applicationData.lastName,
      email: this._applicationData.email,
      summary: this._formattedMessage(this._applicationData),
      resume: {
        name: this._applicationData.resumeName,
        data: this._applicationData.resume
      }
    };
  }

  _formattedMessage(application) {
    let socialMedia = '';
    if (application.linkedIn !== undefined) {
      socialMedia = socialMedia + `\nLinkedIn: ${application.linkedIn}`;
    }

    if (application.personalWebsite !== undefined) {
      socialMedia = socialMedia + `\Website: ${application.personalWebsite}`;
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
