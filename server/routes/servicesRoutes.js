const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');

router.get('/', servicesController.getServices);
router.get('/:id', servicesController.getServiceById);
router.get('/:id/analytics', servicesController.getServiceAnalytics);

module.exports = router;
