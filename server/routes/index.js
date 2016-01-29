'use strict';

const express = require('express');
const redisClient = require('../utils/redisClient');
const WorkableJob = require('../models/workableJob');
const router = express.Router();

router.get('/jobs', function(_req, res, next) {
  const workableJob = new WorkableJob();
  redisClient.cacheFetch('publishedjobs', workableJob.getPublishedJobs.bind(undefined))
    .then((jobs) => { res.json({ data: jobs }); })
    .catch((err) => { next(err); });
});

module.exports = router;
