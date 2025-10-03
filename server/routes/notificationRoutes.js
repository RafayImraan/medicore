const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get notifications for the current user
router.get('/', notificationController.getUserNotifications);

// Mark notification as read
router.post('/:id/acknowledge', notificationController.acknowledgeNotification);

// Get unread notification count
router.get('/count', notificationController.getUnreadCount);

module.exports = router;
