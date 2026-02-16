const mongoose = require('mongoose');

const serviceReviewSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, trim: true },
  rating: { type: Number, default: 5 },
  comment: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('ServiceReview', serviceReviewSchema);
