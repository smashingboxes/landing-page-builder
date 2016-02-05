'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const request = require('request-promise');
const app = require('../../server/app');
const port = 3000;
const host = `http://localhost:${port}`;

describe.only('Contact Endpoint', () => {
  const requestOptions = { json: true };
  let server;

  before(() => {
    server = app.listen(port);
    nock.disableNetConnect();
    nock.enableNetConnect(/localhost/);
  });

  beforeEach(() => {
    nock('https://api.mailgun.net:443')
      .post('/v3/smashingboxes.com/messages')
      .reply(200, {
        'id': '<20160204231559.2635.44735@smashingboxes.com>',
        'message': 'Queued. Thank you.'
      });
  });

  describe('POST /contact', () => {
    it('sends mail with contact details', done => {
      requestOptions.uri = `${host}/contact`;
      requestOptions.body = {
        data: {
          category: 'Project', // Projects and General
          firstName: 'James',
          lastName: 'Kirk',
          jobTitle: 'Captain',
          compamy: 'United Federation of Planets',
          message: 'KHAAAAAAAAAAAAAAAAAAAAAAN!'
        }
      };

      request.post(requestOptions)
        .then(res => {
          expect(res.data.status).to.equal('mailed');
          done();
        })
        .catch(err => done(err));
    });
  });

  after(() => {
    server.close();
  });
});
