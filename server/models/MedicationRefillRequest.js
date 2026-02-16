const mongoose = require('mongoose');

const medicationRefillRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  medicationId: { type: String, trim: true },
  medicationName: { type: String, trim: true },
  dosage: { type: String, trim: true },
  form: { type: String, trim: true },
  source: { type: String, default: 'hero' },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('MedicationRefillRequest', medicationRefillRequestSchema);
