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
      .then(reply => JSON.parse(reply));
  }

  _resolveCacheMiss(key, promise) {
    return promise()
      .then(data => JSON.stringify(data))
      .then(this._setKey.bind(this, key))
      .catch(() => this.client.getAsync(`${key}bak`));
  }

  _getKey(key) {
    return this.client.getAsync(key).then((reply) => {
      if (reply === null) { throw new CacheMissError('cache miss'); }
      return reply;
    });
  }

  _setKey(key, value) {
    this.client.expire(key, cacheTime);
    this.client.set(`${key}bak`, value);
    this.client.set(key, value);

    return value;
  }

  _setClient() {
    this.client = redis.createClient();
  }

  _closeClient() {
    this.client.end(true);
  }
}

module.exports = new RedisClient();
