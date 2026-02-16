const mongoose = require('mongoose');

const pricingCalcResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessions: { type: Number, default: 1 },
  planType: { type: String, trim: true },
  includeHomeVisit: { type: Boolean, default: false },
  subtotal: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('PricingCalcResult', pricingCalcResultSchema);
