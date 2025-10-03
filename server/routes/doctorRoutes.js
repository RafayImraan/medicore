const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Doctor routes
router.post('/', doctorController.createDoctor);
router.get('/:userId', doctorController.getDoctor);
router.put('/:userId', doctorController.updateDoctor);
router.get('/', doctorController.getAllDoctors);
router.get('/specialization/:specialization', doctorController.getDoctorsBySpecialization);
router.put('/:userId/availability', doctorController.updateAvailability);
router.get('/:doctorId/queue', doctorController.getPatientQueue);

// Featured doctor route
router.get('/featured', doctorController.getFeaturedDoctor);

module.exports = router;
