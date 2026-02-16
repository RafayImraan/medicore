const mongoose = require('mongoose');

const homeHealthcarePressSchema = new mongoose.Schema({
  outlet: { type: String, required: true, trim: true },
  headline: { type: String, required: true, trim: true },
  link: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('HomeHealthcarePress', homeHealthcarePressSchema);
