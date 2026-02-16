const mongoose = require('mongoose');

const departmentDoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  slots: [{ type: String }]
}, { _id: false });

const departmentSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  iconKey: { type: String, required: true },
  head: { type: String, required: true },
  description: { type: String, required: true },
  timings: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  services: [{ type: String }],
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 100 },
  badges: [{ type: String }],
  occupancy: { type: Number, default: 0.6 },
  waitMins: { type: Number, default: 20 },
  doctors: [departmentDoctorSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);
