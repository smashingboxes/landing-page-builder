'use strict';

const expect = require('chai').expect;
const request = require('request');
const app = require('../../server/app');
const port = 3000;

describe('GET /jobs', () => {
  let server;

  before(() => {
    server = app.listen(port);
  });

  it('hits the endpoint', (done) => {
    request('http://localhost:3000/jobs', (_error, response) => {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  after(() => {
    server.close();
  });
});
