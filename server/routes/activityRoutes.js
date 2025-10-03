const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Get user's own activity
router.get('/my-activity',
  verifyToken,
  (req, res) => activityController.getUserActivity({ ...req, params: { userId: req.user._id } }, res)
);

// Get specific user's activity (admin)
router.get('/user/:userId',
  verifyToken,
  requireRole(['admin']),
  activityController.getUserActivity
);

// Get all activity logs (admin)
router.get('/',
  verifyToken,
  requireRole(['admin']),
  activityController.getAllActivity
);

// Get activity summary
router.get('/summary',
  verifyToken,
  activityController.getActivitySummary
);

// Get activity statistics (admin)
router.get('/stats',
  verifyToken,
  requireRole(['admin']),
  activityController.getActivityStats
);

// Get security alerts (admin)
router.get('/security-alerts',
  verifyToken,
  requireRole(['admin']),
  activityController.getSecurityAlerts
);

module.exports = router;
