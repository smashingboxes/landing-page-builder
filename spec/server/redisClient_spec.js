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

  const promiseErrorFunction = function(promiseErr) {
    return () => { return Promise.reject(promiseErr); };
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

    it('uses it\'s last fallback value if there is an error retrieving the key', (done) => {
      const error = new Error('api fetch failed');

      redisClient.cacheFetch(key, promiseFunction(value))
        .then(() => {
          // simulate key being expired
          client.del(key, () => {
            // promise errors, api down, etc
            redisClient.cacheFetch(key, promiseErrorFunction(error))
              .then((returnValue) => {
                expect(returnValue).to.equal(value);
                done();
              })
              .catch((err) => { done(err); });
          });
        });
    });
  });
});
