const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  avatar: {
    type: String,
    default: ''
  },
  available: {
    type: Boolean,
    default: true
  },
  specialization: {
    type: String,
    enum: ['General', 'Technical', 'Billing', 'Appointments', 'Medical'],
    default: 'General'
  },
  languages: [{
    type: String,
    trim: true
  }],
  experience: {
    type: Number,
    min: 0,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalChats: {
    type: Number,
    default: 0
  },
  activeChats: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
agentSchema.index({ available: 1, specialization: 1 });
agentSchema.index({ email: 1 });

module.exports = mongoose.model('Agent', agentSchema);
