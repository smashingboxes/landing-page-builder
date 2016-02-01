'use strict';

const expect = require('chai').expect;
const request = require('request-promise');
const nock = require('nock');
const app = require('../../server/app');
const redisClient = require('../../server/utils/redisClient').client;
const port = 3000;

describe('GET /jobs', () => {
  const requestOptions = { json: true };
  let server;

  const mockWorkableJobs = function() {
    return nock('https://www.workable.com/spi/v3/accounts/smashingboxes')
      .get('/jobs')
      .query({ state: 'published' });
  };

  before(() => {
    server = app.listen(port);
  });

  beforeEach((done) => {
    nock.restore();
    mockWorkableJobs().replyWithFile(200, './spec/fixtures/workable_jobs.json');
    mockWorkableJobs().replyWithError('should not have been called');
    redisClient.flushdb(() => { done(); });
  });

  it('returns a list of jobs', (done) => {
    requestOptions.uri = 'http://localhost:3000/jobs';
    request(requestOptions).then((body) => {
      expect(body.data[0]).to.be.a('object');
      done();
    });
  });

  it('caches the jobs list after the first request', (done) => {
    requestOptions.uri = 'http://localhost:3000/jobs';
    request(requestOptions)
      .then(() => { return request(requestOptions); })
      .then(() => { done(); })
      .catch((err) => { done(err); });
  });

  it('includes a slug on the jobs', (done) => {
    requestOptions.uri = 'http://localhost:3000/jobs';
    request(requestOptions).then((body) => {
      expect(body.data[0].slug).to.equal('product-director');
      done();
    });
  });

  after(() => {
    server.close();
  });
});
