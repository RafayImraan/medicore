const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken, requireAnyAuthenticated } = require('../middleware/auth');

// Get cart for patient
router.get('/:patientId', verifyToken, requireAnyAuthenticated, cartController.getCart);

// Add item to cart
router.post('/add', verifyToken, requireAnyAuthenticated, cartController.addToCart);

// Update item quantity
router.put('/update', verifyToken, requireAnyAuthenticated, cartController.updateQuantity);

// Remove item from cart
router.delete('/:patientId/remove/:medicineId', verifyToken, requireAnyAuthenticated, cartController.removeFromCart);

// Clear cart
router.delete('/:patientId/clear', verifyToken, requireAnyAuthenticated, cartController.clearCart);

module.exports = router;
