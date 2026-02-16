const mongoose = require('mongoose');

const offerClaimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  code: { type: String, trim: true },
  source: { type: String, default: 'services' }
}, { timestamps: true });

module.exports = mongoose.model('OfferClaim', offerClaimSchema);
