const mongoose = require('mongoose');

const symptomCheckSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  symptoms: { type: [String], default: [] },
  result: { type: String, trim: true },
  recommendation: { type: String, trim: true },
  source: { type: String, default: 'hero' }
}, { timestamps: true });

module.exports = mongoose.model('SymptomCheck', symptomCheckSchema);
