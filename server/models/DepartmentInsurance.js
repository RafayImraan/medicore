const mongoose = require('mongoose');

const departmentInsuranceSchema = new mongoose.Schema({
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  insurerId: { type: String, trim: true },
  name: { type: String, required: true, trim: true },
  plan: { type: String, trim: true },
  network: { type: String, trim: true },
  coverage: { type: String, trim: true },
  copay: { type: String, trim: true },
  preAuthRequired: { type: Boolean, default: false },
  phone: { type: String, trim: true },
  notes: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('DepartmentInsurance', departmentInsuranceSchema);
