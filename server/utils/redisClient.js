'use strict';

const redis = require('redis');
const cacheTime = 3600; // 1 hour

class RedisClient {
  constructor() {
    this.client = redis.createClient();
  }

  cacheFetch(key, promise) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err !== null) { reject(err); }

        if (reply === null) {
          promise()
            .then((data) => {
              this.client.set(key, JSON.stringify(data), () => { resolve(data); });
              this.client.expire(key, cacheTime);
            })
            .catch((promiseErr) => { reject(promiseErr); });
        } else {
          resolve(JSON.parse(reply));
        }
      });
    });
  }
}

module.exports = new RedisClient();
