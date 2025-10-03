const express = require('express');
const router = express.Router();
const vitalsController = require('../controllers/vitalsController');

// Vitals routes
router.get('/live', vitalsController.getVitalsLive);
router.get('/patient/:patientId', vitalsController.getPatientVitals);
router.post('/', vitalsController.createVitals);
router.put('/:id', vitalsController.updateVitals);
router.delete('/:id', vitalsController.deleteVitals);

module.exports = router;
