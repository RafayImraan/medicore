const mongoose = require('mongoose');

const homeHealthcarePartnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  logo: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('HomeHealthcarePartner', homeHealthcarePartnerSchema);
