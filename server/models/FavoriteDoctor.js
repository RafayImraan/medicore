const mongoose = require('mongoose');

const favoriteDoctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: String, trim: true },
  doctorName: { type: String, trim: true },
  specialty: { type: String, trim: true },
  source: { type: String, default: 'hero' }
}, { timestamps: true });

module.exports = mongoose.model('FavoriteDoctor', favoriteDoctorSchema);
