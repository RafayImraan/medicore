const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  allDay: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    trim: true
  },
  eventType: {
    type: String,
    enum: ['appointment', 'meeting', 'reminder', 'personal', 'system'],
    default: 'personal'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  relatedAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  relatedPatient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  recurrence: {
    type: {
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
      },
      interval: {
        type: Number,
        default: 1,
        min: 1
      },
      endDate: Date,
      count: Number
    }
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'notification', 'sms'],
      required: true
    },
    time: {
      type: Number, // minutes before event
      required: true
    },
    sent: {
      type: Boolean,
      default: false
    }
  }],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  color: {
    type: String,
    default: '#3B82F6' // Default blue color
  },
  isPublic: {
    type: Boolean,
    default: false
  },
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
calendarEventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
calendarEventSchema.index({ startTime: 1, endTime: 1 });
calendarEventSchema.index({ createdBy: 1, startTime: -1 });
calendarEventSchema.index({ assignedTo: 1 });
calendarEventSchema.index({ eventType: 1 });
calendarEventSchema.index({ status: 1 });

// Virtual for duration
calendarEventSchema.virtual('duration').get(function() {
  return this.endTime - this.startTime;
});

// Method to check if event conflicts with another
calendarEventSchema.methods.conflictsWith = function(otherEvent) {
  return (this.startTime < otherEvent.endTime && this.endTime > otherEvent.startTime);
};

// Method to generate recurring events
calendarEventSchema.methods.generateRecurringEvents = function(untilDate) {
  const events = [];
  let currentDate = new Date(this.startTime);

  while (currentDate <= untilDate) {
    if (currentDate > this.startTime) {
      const newEvent = new mongoose.model('CalendarEvent')(this.toObject());
      newEvent._id = mongoose.Types.ObjectId();
      newEvent.startTime = new Date(currentDate);
      newEvent.endTime = new Date(currentDate.getTime() + (this.endTime - this.startTime));
      newEvent.recurrence = undefined; // Remove recurrence from generated events
      events.push(newEvent);
    }

    // Calculate next occurrence
    switch (this.recurrence.frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + this.recurrence.interval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + (7 * this.recurrence.interval));
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + this.recurrence.interval);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + this.recurrence.interval);
        break;
    }
  }

  return events;
};

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
