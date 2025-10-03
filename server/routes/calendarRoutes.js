const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { verifyToken } = require('../middleware/auth');

// Create calendar event
router.post('/',
  verifyToken,
  calendarController.createEvent
);

// Get events for a user
router.get('/user/:userId',
  verifyToken,
  calendarController.getUserEvents
);

// Update calendar event
router.put('/:eventId',
  verifyToken,
  calendarController.updateEvent
);

// Delete calendar event
router.delete('/:eventId',
  verifyToken,
  calendarController.deleteEvent
);

module.exports = router;
