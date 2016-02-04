'use strict';

const express = require('express');
const WorkableJob = require('../models/workableJob');
const Application = require('../models/application');
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

router.post('/:slug/applications', (req, res, next) => {
  const application = new Application(req.body.data);
  if (application.isValid()) {
    jobAPI.createApplication(req.params.slug, application)
      .then(resApp => res.status(201).json({ data: resApp }))
      .catch(err => next(err));
  } else {
    res.status(422).json({ errors: application.errors });
  }
});

module.exports = router;
