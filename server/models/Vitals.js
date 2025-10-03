const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  bloodPressure: {
    systolic: { type: Number, required: true },
    diastolic: { type: Number, required: true }
  },
  heartRate: { type: Number, required: true },
  temperature: { type: Number, required: true },
  bloodSugar: { type: Number },
  weight: { type: Number },
  oxygenSaturation: { type: Number },
  respiratoryRate: { type: Number },
  notes: { type: String },
  recordedAt: { type: Date, default: Date.now },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Virtual for formatted blood pressure
vitalsSchema.virtual('formattedBP').get(function() {
  return `${this.bloodPressure.systolic}/${this.bloodPressure.diastolic}`;
});

// Virtual for formatted temperature
vitalsSchema.virtual('formattedTemp').get(function() {
  return `${this.temperature.toFixed(1)}°C`;
});

module.exports = mongoose.model('Vitals', vitalsSchema);
