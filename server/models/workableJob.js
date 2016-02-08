'use strict';

require('dotenv').load();
const request = require('request-promise');
const redisClient = require('../utils/redisClient');
const NotFoundError = require('../utils/errors').NotFoundError;

class WorkableJob {
  constructor(token, baseUrl) {
    this.token = token || process.env.WORKABLE_TOKEN;
    this.baseUrl = baseUrl ||
      'https://www.workable.com/spi/v3/accounts/smashingboxes';
    this.publishedJobs = this._publishedJobs.bind(this);
  }

  getPublishedJobs() {
    return redisClient.cacheFetch('publishedjobs', this.publishedJobs);
  }

  getJobBySlug(slug) {
    return redisClient.cacheFetch(
      `jobBySlug${slug}`,
      this._jobBySlug.bind(this, slug)
    );
  }

  createApplication(slug, application) {
    const requestOptions = this._requestOptions();
    return this.getJobBySlug(slug).then(job => {
      requestOptions.uri = `${this.baseUrl}/jobs/${job.shortcode}/candidates`;
      requestOptions.body = {
        sourced: false,
        candidate: application.toCandidate()
      };

      return request.post(requestOptions);
    });
  }

  _jobBySlug(slug) {
    return this.getPublishedJobs()
      .then(jobs => {
        const job = jobs.find(thisJob => slug === thisJob.slug);

        if (job === undefined) {
          throw new NotFoundError(`Job, ${slug} not found.`);
        }
        return job;
      })
      .then(job => {
        const shortcode = job.shortcode;
        const requestOptions = this._requestOptions();
        requestOptions.uri = `${this.baseUrl}/jobs/${shortcode}`;
        return request(requestOptions);
      });
  }

  _publishedJobs() {
    const requestOptions = this._requestOptions();
    requestOptions.uri = `${this.baseUrl}/jobs`;
    requestOptions.qs = { state: 'published' };

    return request(requestOptions)
      .then(data => data.jobs)
      .then((jobs) => {
        return jobs.map((job) => {
          job.slug = this._slugify(job.title);
          return job;
        });
      });
  }
  // Slugify
  // params @string string a string to slugify
  // returns a slugified string
  // Would turn "Product Director" into "product-director"
  _slugify(string) {
    return string.toLowerCase()
      .replace(/[^a-z0-9]/gi, '-') // replace everything with a dash
      .replace(/-+/gi, '-');       // turn multiple dashes into 1
  }

  _requestOptions() {
    return {
      json: true,
      headers: { Authorization: `Bearer ${this.token}` }
    };
  }
}

module.exports = WorkableJob;
