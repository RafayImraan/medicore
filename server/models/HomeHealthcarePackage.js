const mongoose = require('mongoose');

const homeHealthcarePackageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  highlight: { type: Boolean, default: false },
  perks: [{ type: String }],
  cta: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('HomeHealthcarePackage', homeHealthcarePackageSchema);
