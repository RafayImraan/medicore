const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingIntegrationController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Create billing record (admin, doctor)
router.post('/',
  verifyToken,
  requireRole(['admin', 'doctor']),
  billingController.createBilling
);

// Process payment (admin, doctor)
router.post('/:billingId/process-payment',
  verifyToken,
  requireRole(['admin', 'doctor']),
  billingController.processPayment
);

// Get billing records for a patient (admin, doctor, patient)
router.get('/patient/:patientId',
  verifyToken,
  billingController.getPatientBilling
);

// Get billing statistics (admin)
router.get('/stats',
  verifyToken,
  requireRole(['admin']),
  billingController.getBillingStats
);

// Update billing record (admin, doctor)
router.put('/:billingId',
  verifyToken,
  requireRole(['admin', 'doctor']),
  billingController.updateBilling
);

// Delete billing record (admin only)
router.delete('/:billingId',
  verifyToken,
  requireRole(['admin']),
  billingController.deleteBilling
);

module.exports = router;
