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
        this.rejectErr(err, reject);

        if (reply === null) {
          promise()
            .then((data) => {
              this.client.set(key, JSON.stringify(data));
              this.client.expire(key, cacheTime);
              resolve(data);
            })
            .catch((promiseErr) => { reject(promiseErr); });
        } else {
          resolve(JSON.parse(reply));
        }
      });
    });
  }

  rejectErr(err, reject) {
    if (err !== null) { reject(err); }
  }
}

module.exports = new RedisClient();
