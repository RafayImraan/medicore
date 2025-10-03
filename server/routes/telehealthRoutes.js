const express = require('express');
const router = express.Router();
const telehealthController = require('../controllers/telehealthController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Create telehealth session (admin, doctor)
router.post('/session',
  verifyToken,
  requireRole(['admin', 'doctor']),
  telehealthController.createSession
);

// Get session by ID (authenticated users)
router.get('/session/:sessionId',
  verifyToken,
  telehealthController.getSession
);

// Get sessions for a user (authenticated users)
router.get('/user/:userId/sessions',
  verifyToken,
  telehealthController.getUserSessions
);

// Join telehealth session (authenticated users)
router.post('/session/:sessionId/join',
  verifyToken,
  telehealthController.joinSession
);

// Leave telehealth session (authenticated users)
router.post('/session/:sessionId/leave',
  verifyToken,
  telehealthController.leaveSession
);

// End telehealth session (admin, doctor)
router.post('/session/:sessionId/end',
  verifyToken,
  requireRole(['admin', 'doctor']),
  telehealthController.endSession
);

// Report technical issue (authenticated users)
router.post('/session/:sessionId/issue',
  verifyToken,
  telehealthController.reportIssue
);

// Get telehealth statistics (admin)
router.get('/stats',
  verifyToken,
  requireRole(['admin']),
  telehealthController.getStats
);

module.exports = router;
