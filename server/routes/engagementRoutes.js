const express = require('express');
const router = express.Router();
const engagementController = require('../controllers/engagementController');
const { verifyToken, requireAnyAuthenticated } = require('../middleware/auth');

// Public endpoints (userId optional)
router.get('/stats', engagementController.getEngagementStats);
router.post('/favorites', engagementController.createFavoriteDoctor);
router.post('/article-reads', engagementController.createArticleRead);
router.post('/wellness-enrollments', engagementController.createWellnessEnrollment);
router.post('/challenge-joins', engagementController.createChallengeJoin);
router.post('/medication-refills', engagementController.createMedicationRefill);
router.post('/mood-logs', engagementController.createMoodLog);
router.post('/symptom-checks', engagementController.createSymptomCheck);
router.post('/reminder-logs', engagementController.createReminderLog);
router.post('/insurance-views', engagementController.createInsuranceView);

// Protected mirror routes (if you want auth-required later)
router.post('/auth/favorites', verifyToken, requireAnyAuthenticated, engagementController.createFavoriteDoctor);
router.post('/auth/article-reads', verifyToken, requireAnyAuthenticated, engagementController.createArticleRead);
router.post('/auth/wellness-enrollments', verifyToken, requireAnyAuthenticated, engagementController.createWellnessEnrollment);
router.post('/auth/challenge-joins', verifyToken, requireAnyAuthenticated, engagementController.createChallengeJoin);
router.post('/auth/medication-refills', verifyToken, requireAnyAuthenticated, engagementController.createMedicationRefill);
router.post('/auth/mood-logs', verifyToken, requireAnyAuthenticated, engagementController.createMoodLog);
router.post('/auth/symptom-checks', verifyToken, requireAnyAuthenticated, engagementController.createSymptomCheck);
router.post('/auth/reminder-logs', verifyToken, requireAnyAuthenticated, engagementController.createReminderLog);
router.post('/auth/insurance-views', verifyToken, requireAnyAuthenticated, engagementController.createInsuranceView);

module.exports = router;
