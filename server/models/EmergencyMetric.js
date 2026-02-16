const mongoose = require('mongoose');

const emergencyMetricSchema = new mongoose.Schema({
  erQueueWaiting: { type: Number, default: 0 },
  erWaitMins: { type: Number, default: 0 },
  erBeds: { type: Number, default: 0 },
  icuBeds: { type: Number, default: 0 },
  ventilators: { type: Number, default: 0 },
  isolation: { type: Number, default: 0 },
  workloadTrend: [{
    period: { type: String, default: '' },
    visits: { type: Number, default: 0 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('EmergencyMetric', emergencyMetricSchema);
