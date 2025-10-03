const mongoose = require('mongoose');

const telehealthSessionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'waiting', 'in_progress', 'completed', 'cancelled', 'failed'],
    default: 'scheduled'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in minutes
    min: 0
  },
  platform: {
    type: String,
    enum: ['zoom', 'teams', 'google_meet', 'custom'],
    default: 'custom'
  },
  meetingUrl: {
    type: String,
    trim: true
  },
  recordingUrl: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  technicalIssues: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    issue: {
      type: String,
      required: true
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }],
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'nurse', 'admin']
    },
    joinedAt: Date,
    leftAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
telehealthSessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate duration when session ends
telehealthSessionSchema.methods.calculateDuration = function() {
  if (this.endTime && this.startTime) {
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60)); // in minutes
  }
};

// Index for efficient queries
telehealthSessionSchema.index({ appointmentId: 1 });
telehealthSessionSchema.index({ patientId: 1, status: 1 });
telehealthSessionSchema.index({ doctorId: 1, startTime: -1 });
telehealthSessionSchema.index({ startTime: -1 });

module.exports = mongoose.model('TelehealthSession', telehealthSessionSchema);
