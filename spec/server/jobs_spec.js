'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const request = require('request-promise');
const app = require('../../server/app');
const redisClient = require('../../server/utils/redisClient').client;
const port = 3000;

describe('Job Endpoints', () => {
  const requestOptions = { json: true };
  let server;

  const mockWorkableJobs = () => {
    return nock('https://www.workable.com/spi/v3/accounts/smashingboxes')
      .get('/jobs')
      .query({ state: 'published' });
  };

  before(() => {
    server = app.listen(port);
    nock.disableNetConnect();
    nock.enableNetConnect(/localhost/);
  });

  beforeEach((done) => {
    nock.cleanAll();
    mockWorkableJobs().replyWithFile(200, './spec/fixtures/workable_jobs.json');
    mockWorkableJobs().replyWithError('should not have been called');
    redisClient.flushdb(() => { done(); });
  });


  describe('GET /jobs', () => {
    beforeEach((done) => {
      nock.cleanAll();
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
  });

  describe('GET /jobs/:slug', () => {
    const mockSingleWorkableJob = () => {
      return nock('https://www.workable.com/spi/v3/accounts/smashingboxes')
        .get('/jobs/A02AF3EE6C');
    };

    it('get\'s a job by slug', (done) => {
      mockSingleWorkableJob().replyWithFile(200, './spec/fixtures/workable_job.json');
      requestOptions.uri = 'http://localhost:3000/jobs/product-director';
      request(requestOptions).then((body) => {
        expect(body.data.title).to.equal('Product Director');
        expect(body.data.full_description).to.contain('Product Director');
        done();
      });
    });

    it('caches the job after the first request', (done) => {
      mockSingleWorkableJob().replyWithFile(200, './spec/fixtures/workable_job.json');
      mockSingleWorkableJob().replyWithError('should not happen');
      requestOptions.uri = 'http://localhost:3000/jobs/product-director';
      request(requestOptions)
        .then(() => { return request(requestOptions); })
        .then(() => { done(); })
        .catch((err) => { done(err); });
    });

    it('handles a non existant slug', (done) => {
      mockSingleWorkableJob().reply(404);
      requestOptions.uri = 'http://localhost:3000/jobs/awesome-director';
      request(requestOptions)
        .then(() => done(new Error('Should not have succeeded')))
        .catch(err => {
          expect(err.statusCode).to.equal(404);
          done();
        });
    });
  });

  after(() => {
    server.close();
  });
});
