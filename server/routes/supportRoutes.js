const express = require('express');
const router = express.Router();
const {
  getSupportStats,
  getAgents,
  getAgentById,
  updateAgentAvailability
} = require('../controllers/supportController');

// Get support statistics
router.get('/support-stats', getSupportStats);

// Get all support agents
router.get('/agents', getAgents);

// Get agent by ID
router.get('/agents/:id', getAgentById);

// Update agent availability (admin only - would need auth middleware)
router.put('/agents/:id/availability', updateAgentAvailability);

module.exports = router;
