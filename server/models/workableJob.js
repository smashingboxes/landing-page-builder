'use strict';

require('dotenv').load();
const request = require('request-promise');

class WorkableJob {
  constructor(token, baseUrl) {
    this.token = token || process.env.WORKABLE_TOKEN;
    this.baseUrl = baseUrl ||
      'https://www.workable.com/spi/v3/accounts/smashingboxes';
    this.requestOptions = {
      json: true,
      qs: { state: 'published'},
      headers: { Authorization: `Bearer ${this.token}` }
    };
  }

  getPublishedJobs() {
    this.requestOptions.uri = `${this.baseUrl}/jobs`;

    return new Promise((resolve, reject) => {
      request(this.requestOptions)
        .then((data) => { resolve(data.jobs); })
        .catch((err) => { reject(err); });
    });
  }
}

module.exports = WorkableJob;
