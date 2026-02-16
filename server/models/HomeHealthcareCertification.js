const mongoose = require('mongoose');

const homeHealthcareCertificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('HomeHealthcareCertification', homeHealthcareCertificationSchema);
