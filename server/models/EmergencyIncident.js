const mongoose = require('mongoose');

const emergencyIncidentSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  level: { type: String, enum: ['info', 'urgent', 'critical'], default: 'info' },
  occurredAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyIncident', emergencyIncidentSchema);
