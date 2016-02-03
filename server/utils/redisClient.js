'use strict';

const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
const cacheTime = 3600; // 1 hour


class CacheMissError extends Error { }

class RedisClient {
  constructor() {
    this._setClient();
  }

  cacheFetch(key, promise) {
    return this._getKey(key)
      .catch(CacheMissError, this._resolveCacheMiss.bind(this, key, promise))
      .then(this._setKey.bind(this, key));
  }

  _resolveCacheMiss(key, promise) {
    return promise()
      .then(data => JSON.stringify(data))
      .catch(err => {
        return this.client.getAsync(`${key}bak`)
          .then(reply => {
            // If the backup is null, then don't fallback; there is a real
            // problem.
            if (reply === null) { throw err; }
            return reply;
          });
      })
      .then(reply => JSON.parse(reply));
  }

  _getKey(key) {
    return this.client.getAsync(key).then((reply) => {
      if (reply === null) { throw new CacheMissError('cache miss'); }
      return JSON.parse(reply);
    });
  }

  _setKey(key, data) {
    this.client.expire(key, cacheTime);
    this.client.set(`${key}bak`, JSON.stringify(data));
    this.client.set(key, JSON.stringify(data));

    return data;
  }

  _setClient() {
    this.client = redis.createClient();
  }

  _closeClient() {
    this.client.end(true);
  }
}

module.exports = new RedisClient();
