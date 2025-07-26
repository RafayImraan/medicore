const express = require('express');
const router = express.Router();
const { getReportByTestId } = require('../controllers/reportController');

// GET /reports/:id - Get report by testId
router.get('/:id', getReportByTestId);

module.exports = router;
