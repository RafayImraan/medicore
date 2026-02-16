const mongoose = require('mongoose');

const labResultSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  testName: {
    type: String,
    required: true
  },
  patientName: {
    type: String
  },
  doctorName: {
    type: String
  },
  technicianName: {
    type: String
  },
  severity: {
    type: String,
    enum: ['Low', 'Moderate', 'High']
  },
  recurring: {
    type: Boolean,
    default: false
  },
  flaggedForFollowUp: {
    type: Boolean,
    default: false
  },
  referenceRange: {
    type: String
  },
  anatomyRegion: {
    type: String
  },
  notes: {
    type: String
  },
  version: {
    type: String
  },
  department: {
    type: String
  },
  language: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  result: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Ready', 'Pending', 'Reviewed'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LabResult', labResultSchema);
