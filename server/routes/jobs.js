'use strict';

const express = require('express');
const WorkableJob = require('../models/workableJob');
const workableJob = new WorkableJob();
const router = express.Router();

router.get('/jobs', (_req, res, next) => {
  workableJob.getPublishedJobs()
    .then(jobs => res.json({ data: jobs }))
    .catch(err => next(err));
});

router.get('/jobs/:slug', (req, res, next) => {
  workableJob.getJobBySlug(req.params.slug)
    .then(job => res.json({ data: job }))
    .catch(err => next(err));
});

module.exports = router;
