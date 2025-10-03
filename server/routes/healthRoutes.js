const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const { noCache } = require('../middleware/performance');

// Basic health check (no auth required)
router.get('/', noCache, healthController.healthCheck);

// Detailed system metrics (admin only)
router.get('/metrics',
  require('../middleware/auth').verifyToken,
  require('../middleware/auth').requireRole(['admin']),
  noCache,
  healthController.systemMetrics
);

// Database metrics (admin only)
router.get('/database',
  require('../middleware/auth').verifyToken,
  require('../middleware/auth').requireRole(['admin']),
  noCache,
  healthController.databaseMetrics
);

// Application metrics (admin only)
router.get('/app',
  require('../middleware/auth').verifyToken,
  require('../middleware/auth').requireRole(['admin']),
  noCache,
  healthController.appMetrics
);

module.exports = router;
