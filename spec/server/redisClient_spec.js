'use strict';

const expect = require('chai').expect;
const redisClient = require('../../server/utils/redisClient');

describe('RedisClient', () => {
  const client =  redisClient.client;
  const key = 'key';
  const value = 'test';
  const promiseFunction = function(promiseValue) {
    return () => { return Promise.resolve(promiseValue); };
  };

  beforeEach((done) => {
    client.flushdb(() => { done(); });
  });

  describe('#cacheFetch', () => {
    it('caches the value returned by a callback', (done) => {
      redisClient.cacheFetch(key, promiseFunction(value))
        .then(() => {
          return redisClient.cacheFetch(key, promiseFunction('other'));
        })
        .then(() => {
          client.get(key, (err, reply) => {
            expect(JSON.parse(reply)).to.equal(value);
            done();
          });
        });
    });
  });
});
