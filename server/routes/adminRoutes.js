const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const notificationController = require('../controllers/notificationController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Apply authentication and admin role requirement to all admin routes
router.use(verifyToken);
router.use(requireAdmin);

// Dashboard statistics
router.get('/stats', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Notifications
router.get('/notifications', notificationController.getNotifications);
router.put('/notifications/:id/read', notificationController.markAsRead);

// Revenue analytics
router.get('/analytics/revenue', adminController.getRevenueAnalytics);

// ==================== INCIDENT MANAGEMENT ====================
router.get('/incidents', adminController.getIncidents);
router.get('/incidents/:id', adminController.getIncidentById);
router.post('/incidents', adminController.createIncident);
router.put('/incidents/:id', adminController.updateIncident);
router.delete('/incidents/:id', adminController.deleteIncident);

// ==================== TASK MANAGEMENT ====================
router.get('/tasks', adminController.getTasks);
router.get('/tasks/:id', adminController.getTaskById);
router.post('/tasks', adminController.createTask);
router.put('/tasks/:id', adminController.updateTask);
router.delete('/tasks/:id', adminController.deleteTask);
router.post('/tasks/:id/comments', adminController.addTaskComment);

// ==================== REPORT MANAGEMENT ====================
router.get('/reports', adminController.getReports);
router.post('/reports/generate', adminController.generateReport);
router.get('/reports/download/:id', adminController.downloadReport);

module.exports = router;
