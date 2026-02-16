const mongoose = require('mongoose');

const departmentReviewSchema = new mongoose.Schema({
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, trim: true, default: 'Anonymous' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, trim: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('DepartmentReview', departmentReviewSchema);
