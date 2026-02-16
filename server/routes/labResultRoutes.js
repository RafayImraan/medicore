const express = require('express');
const router = express.Router();
const labResultController = require('../controllers/labResultController');

router.get('/', labResultController.getLabResults);
router.put('/:id/status', labResultController.updateLabResultStatus);

module.exports = router;
