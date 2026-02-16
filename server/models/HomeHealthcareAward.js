const mongoose = require('mongoose');

const homeHealthcareAwardSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  title: { type: String, required: true, trim: true },
  organization: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('HomeHealthcareAward', homeHealthcareAwardSchema);
