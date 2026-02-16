const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");

// Billing routes
router.post('/', billingController.createBill);
router.get('/', billingController.getAllBills);
router.get('/status/pending', billingController.getPendingBills);
router.get('/analytics/revenue', billingController.getRevenueAnalytics);
router.get('/patient/:patientId', billingController.getPatientBills);
router.get('/doctor/:doctorId', billingController.getDoctorBills);
router.get('/:id', billingController.getBill);
router.put('/:id/payment-status', billingController.updatePaymentStatus);
router.delete('/:id', billingController.deleteBill);

module.exports = router;
