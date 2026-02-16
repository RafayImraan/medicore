const mongoose = require('mongoose');

const departmentEngagementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  action: { type: String, required: true, trim: true },
  meta: { type: Object, default: {} },
  source: { type: String, default: 'departments' }
}, { timestamps: true });

module.exports = mongoose.model('DepartmentEngagement', departmentEngagementSchema);
