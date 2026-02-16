const mongoose = require('mongoose');

const insuranceViewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  insuranceId: { type: String, trim: true },
  name: { type: String, trim: true },
  network: { type: String, trim: true },
  coverage: { type: String, trim: true },
  source: { type: String, default: 'hero' }
}, { timestamps: true });

module.exports = mongoose.model('InsuranceView', insuranceViewSchema);
