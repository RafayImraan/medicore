const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  getPublicSettings,
  getAccreditations
} = require('../controllers/settingsController');

// Get all settings (admin only)
router.get('/settings', getSettings);

// Update settings (admin only)
router.put('/settings', updateSettings);

// Get public settings (no auth required)
router.get('/settings/public', getPublicSettings);

// Get accreditations
router.get('/settings/accreditations', getAccreditations);

module.exports = router;
