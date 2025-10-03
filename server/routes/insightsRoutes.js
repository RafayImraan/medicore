const express = require('express');
const router = express.Router();
const { getInsights } = require('../controllers/insightsController');

// Public route for insights
router.get('/insights', getInsights);

module.exports = router;
