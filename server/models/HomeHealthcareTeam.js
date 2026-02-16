const mongoose = require('mongoose');

const homeHealthcareTeamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  years: { type: Number, default: 0 },
  specialty: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('HomeHealthcareTeam', homeHealthcareTeamSchema);
