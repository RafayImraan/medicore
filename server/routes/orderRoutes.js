const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, requireAnyAuthenticated } = require('../middleware/auth');

// Place a new order
router.post('/', verifyToken, requireAnyAuthenticated, orderController.createOrder);

// Get orders for a patient
router.get('/patient/:patientId', verifyToken, requireAnyAuthenticated, orderController.getOrdersByPatient);

module.exports = router;
