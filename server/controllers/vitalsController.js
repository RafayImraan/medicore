const Vitals = require('../models/Vitals');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Get live vitals data for dashboard
const getVitalsLive = async (req, res) => {
  try {
    const { doctorId } = req.query;

    // Get recent vitals for patients assigned to this doctor
    const vitals = await Vitals.find()
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
      .sort({ recordedAt: -1 })
      .limit(20);

    // Format for dashboard display
    const formattedVitals = vitals.map(vital => ({
      id: vital._id,
      patient: vital.patientId?.userId?.name || 'Unknown Patient',
      bp: `${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}`,
      hr: vital.heartRate,
      sugar: vital.bloodSugar || 'N/A',
      temp: vital.temperature.toFixed(1),
      ts: new Date(vital.recordedAt).toLocaleTimeString(),
      timestamp: vital.recordedAt
    }));

    res.json(formattedVitals);
  } catch (error) {
    console.error('Error fetching live vitals:', error);
    res.status(500).json({ message: 'Error fetching vitals data' });
  }
};

// Get vitals for a specific patient
const getPatientVitals = async (req, res) => {
  try {
    const { patientId } = req.params;

    const vitals = await Vitals.find({ patientId })
      .populate('doctorId', 'name')
      .sort({ recordedAt: -1 });

    res.json(vitals);
  } catch (error) {
    console.error('Error fetching patient vitals:', error);
    res.status(500).json({ message: 'Error fetching patient vitals' });
  }
};

// Create new vitals record
const createVitals = async (req, res) => {
  try {
    const { patientId, doctorId, bloodPressure, heartRate, temperature, bloodSugar, weight, oxygenSaturation, respiratoryRate, notes } = req.body;

    const vitals = new Vitals({
      patientId,
      doctorId,
      bloodPressure,
      heartRate,
      temperature,
      bloodSugar,
      weight,
      oxygenSaturation,
      respiratoryRate,
      notes,
      recordedBy: req.user._id
    });

    await vitals.save();

    // Emit real-time update if socket is available
    if (global.io) {
      global.io.emit('vitals-update', {
        patientId,
        vitals: vitals
      });
    }

    res.status(201).json(vitals);
  } catch (error) {
    console.error('Error creating vitals:', error);
    res.status(500).json({ message: 'Error creating vitals record' });
  }
};

// Update vitals record
const updateVitals = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const vitals = await Vitals.findByIdAndUpdate(id, updates, { new: true });

    if (!vitals) {
      return res.status(404).json({ message: 'Vitals record not found' });
    }

    res.json(vitals);
  } catch (error) {
    console.error('Error updating vitals:', error);
    res.status(500).json({ message: 'Error updating vitals record' });
  }
};

// Delete vitals record
const deleteVitals = async (req, res) => {
  try {
    const { id } = req.params;

    const vitals = await Vitals.findByIdAndDelete(id);

    if (!vitals) {
      return res.status(404).json({ message: 'Vitals record not found' });
    }

    res.json({ message: 'Vitals record deleted successfully' });
  } catch (error) {
    console.error('Error deleting vitals:', error);
    res.status(500).json({ message: 'Error deleting vitals record' });
  }
};

module.exports = {
  getVitalsLive,
  getPatientVitals,
  createVitals,
  updateVitals,
  deleteVitals
};
