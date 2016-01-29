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
    this.getPublishedJobs = this._getPublishedJobs.bind(this);
  }

  _getPublishedJobs() {
    this.requestOptions.uri = `${this.baseUrl}/jobs`;
    return request(this.requestOptions).then((data) => { return data.jobs; });
  }
}

module.exports = WorkableJob;
