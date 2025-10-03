const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");

// Billing routes
router.post('/', billingController.createBill);
router.get('/:id', billingController.getBill);
router.get('/patient/:patientId', billingController.getPatientBills);
router.get('/doctor/:doctorId', billingController.getDoctorBills);
router.put('/:id/payment-status', billingController.updatePaymentStatus);
router.get('/status/pending', billingController.getPendingBills);
router.get('/analytics/revenue', billingController.getRevenueAnalytics);

module.exports = router;
