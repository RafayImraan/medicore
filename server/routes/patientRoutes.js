const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Patient routes
router.post('/', patientController.createPatient);
router.get('/:userId', patientController.getPatient);
router.put('/:userId', patientController.updatePatient);
router.get('/', patientController.getAllPatients);
router.post('/:userId/medical-history', patientController.addMedicalHistory);

// New routes for patient dashboard
router.get('/:userId/lab-results', patientController.getLabResults);
router.get('/:userId/prescriptions', patientController.getPrescriptions);
router.get('/:userId/billing', patientController.getBilling);
router.get('/:userId/notifications', patientController.getNotifications);
router.get('/:userId/appointments', patientController.getAppointments);
router.post('/:userId/billing/:billingId/submit', patientController.submitBill);

module.exports = router;
