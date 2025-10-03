const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Submit feedback (authenticated users)
router.post('/',
  verifyToken,
  feedbackController.submitFeedback
);

// Get user's own feedback
router.get('/my-feedback',
  verifyToken,
  (req, res) => feedbackController.getUserFeedback(req, res, req.user._id)
);

// Get specific user's feedback (admin)
router.get('/user/:userId',
  verifyToken,
  requireRole(['admin']),
  feedbackController.getUserFeedback
);

// Get all feedback (admin)
router.get('/',
  verifyToken,
  requireRole(['admin']),
  feedbackController.getAllFeedback
);

// Update feedback (admin)
router.put('/:feedbackId',
  verifyToken,
  requireRole(['admin']),
  feedbackController.updateFeedback
);

// Get feedback statistics (admin)
router.get('/stats',
  verifyToken,
  requireRole(['admin']),
  feedbackController.getFeedbackStats
);

module.exports = router;
