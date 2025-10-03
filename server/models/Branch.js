const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'Pakistan'
    }
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  services: [{
    type: String,
    enum: ['General Medicine', 'Emergency', 'Surgery', 'Pediatrics', 'Cardiology', 'Dermatology', 'Radiology', 'Laboratory']
  }],
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  isMain: {
    type: Boolean,
    default: false
  },
  capacity: {
    type: Number,
    min: 0,
    default: 100
  },
  currentPatients: {
    type: Number,
    min: 0,
    default: 0
  },
  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],
  facilities: [{
    type: String,
    trim: true
  }],
  emergencyContact: {
    name: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for location-based queries
branchSchema.index({ 'address.city': 1, 'address.state': 1 });
branchSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Branch', branchSchema);
