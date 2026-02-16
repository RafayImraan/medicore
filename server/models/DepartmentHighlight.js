const mongoose = require('mongoose');

const departmentHighlightSchema = new mongoose.Schema({
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  label: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true },
  unit: { type: String, trim: true },
  trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
  delta: { type: String, trim: true },
  iconKey: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('DepartmentHighlight', departmentHighlightSchema);
