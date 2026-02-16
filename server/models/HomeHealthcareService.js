const mongoose = require('mongoose');

const homeHealthcareServiceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  features: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('HomeHealthcareService', homeHealthcareServiceSchema);
