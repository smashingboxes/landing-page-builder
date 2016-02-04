'use strict';

const express = require('express');
const WorkableJob = require('../models/workableJob');
const jobAPI = new WorkableJob();
const router = express.Router();

router.get('/', (_req, res, next) => {
  jobAPI.getPublishedJobs()
    .then(jobs => res.json({ data: jobs }))
    .catch(err => next(err));
});

router.get('/:slug', (req, res, next) => {
  jobAPI.getJobBySlug(req.params.slug)
    .then(job => res.json({ data: job }))
    .catch(err => next(err));
});

module.exports = router;
