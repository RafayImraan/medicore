const mongoose = require('mongoose');

const wellnessEnrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  programId: { type: String, trim: true },
  programName: { type: String, trim: true },
  source: { type: String, default: 'hero' }
}, { timestamps: true });

module.exports = mongoose.model('WellnessEnrollment', wellnessEnrollmentSchema);
