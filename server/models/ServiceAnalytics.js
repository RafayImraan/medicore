const mongoose = require('mongoose');

const serviceAnalyticsSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  views: { type: Number, default: 0 },
  compares: { type: Number, default: 0 },
  bookings: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ServiceAnalytics', serviceAnalyticsSchema);
