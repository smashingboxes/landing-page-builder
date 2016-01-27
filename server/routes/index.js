const express = require('express');
const router = express.Router();

/* GET root route. */
router.get('/', function(_req, res) {
  res.json({ test: 'works' });
});

router.get('/jobs', function(_req, res) {
  res.json({ test: 'works' });
});

module.exports = router;
