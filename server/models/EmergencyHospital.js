const mongoose = require('mongoose');

const emergencyHospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  distanceKm: { type: Number, default: 0 },
  etaMin: { type: Number, default: 0 },
  bedsAvailable: { type: Number, default: 0 },
  icuAvailable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyHospital', emergencyHospitalSchema);
