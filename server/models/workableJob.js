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
      qs: { state: 'published' },
      headers: { Authorization: `Bearer ${this.token}` },
      uri: `${this.baseUrl}/jobs`
    };
    this.getPublishedJobs = this._getPublishedJobs.bind(this);
  }

  _getPublishedJobs() {
    return request(this.requestOptions)
      .then(data => data.jobs)
      .then((jobs) => {
        return jobs.map((job) => {
          job.slug = job.title.toLowerCase()
            .replace(/[^a-z0-9]/gi, '-')
            .replace(/-+/gi, '-');
          return job;
        });
      });
  }
}

module.exports = WorkableJob;
