const mongoose = require('mongoose');

const staffMessageSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Sent', 'Delivered', 'Seen'],
    default: 'Sent'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('StaffMessage', staffMessageSchema);
