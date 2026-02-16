const mongoose = require('mongoose');

const serviceQuizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: { type: [String], default: [] },
  recommendedCategory: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('ServiceQuizResult', serviceQuizResultSchema);
