const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const homeHealthcareController = require('../controllers/homeHealthcareController');
const emergencyController = require('../controllers/emergencyController');
const homeController = require('../controllers/homeController');
const departmentExtrasController = require('../controllers/departmentExtrasController');

router.get('/departments', publicController.getDepartments);
router.get('/departments/announcements', departmentExtrasController.getAnnouncements);
router.get('/departments/highlights', departmentExtrasController.getHighlights);
router.get('/departments/insurers', departmentExtrasController.getInsurers);
router.get('/departments/schedules', departmentExtrasController.getSchedules);
router.get('/departments/recommendations', departmentExtrasController.getRecommendations);
router.get('/departments/reviews', departmentExtrasController.getReviews);
router.post('/departments/reviews', departmentExtrasController.createReview);
router.post('/departments/insurance-view', departmentExtrasController.logInsuranceView);
router.get('/departments/heatmap', departmentExtrasController.getHeatmap);
router.get('/pharmacy', publicController.getPharmacyItems);
router.get('/doctors-directory', publicController.getDoctorsDirectory);
router.get('/home-healthcare', homeHealthcareController.getHomeHealthcare);
router.get('/emergency', emergencyController.getEmergencyData);
router.get('/home', homeController.getHomeContent);

module.exports = router;
