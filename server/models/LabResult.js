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
  }
});

module.exports = mongoose.model('LabResult', labResultSchema);
