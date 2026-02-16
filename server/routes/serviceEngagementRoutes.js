const express = require('express');
const router = express.Router();
const serviceEngagementController = require('../controllers/serviceEngagementController');

router.post('/view', serviceEngagementController.logView);
router.post('/compare', serviceEngagementController.logCompare);
router.post('/favorite', serviceEngagementController.logFavorite);
router.post('/review', serviceEngagementController.submitReview);
router.post('/quiz', serviceEngagementController.submitQuiz);
router.post('/pricing', serviceEngagementController.submitPricingCalc);
router.post('/newsletter', serviceEngagementController.subscribeNewsletter);
router.post('/offer', serviceEngagementController.claimOffer);

module.exports = router;
