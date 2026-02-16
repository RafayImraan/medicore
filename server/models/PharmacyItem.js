const mongoose = require('mongoose');

const pharmacyItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  expiry: { type: Date },
  supplier: { type: String },
  description: { type: String },
  image: { type: String },
  batchNumber: { type: String },
  dosage: { type: String },
  sideEffects: [{ type: String }],
  interactions: [{ type: String }],
  rating: { type: Number, default: 4.0 },
  reviews: { type: Number, default: 0 },
  isPopular: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  discount: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('PharmacyItem', pharmacyItemSchema);
