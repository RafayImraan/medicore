const mongoose = require('mongoose');

const departmentRecommendationSchema = new mongoose.Schema({
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  title: { type: String, required: true, trim: true },
  reason: { type: String, trim: true },
  score: { type: Number, default: 0 },
  tags: [{ type: String, trim: true }]
}, { timestamps: true });

module.exports = mongoose.model('DepartmentRecommendation', departmentRecommendationSchema);
