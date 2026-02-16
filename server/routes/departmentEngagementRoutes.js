const express = require('express');
const router = express.Router();
const departmentEngagementController = require('../controllers/departmentEngagementController');

router.post('/view', departmentEngagementController.logView);
router.post('/compare', departmentEngagementController.logCompare);
router.post('/favorite', departmentEngagementController.logFavorite);
router.post('/contact', departmentEngagementController.logContact);
router.post('/directions', departmentEngagementController.logDirections);
router.post('/booking', departmentEngagementController.logBooking);
router.post('/search', departmentEngagementController.logSearch);
router.post('/chat', departmentEngagementController.logChat);

module.exports = router;
