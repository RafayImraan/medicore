const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login', 'logout', 'register', 'password_change', 'profile_update',
      'appointment_create', 'appointment_update', 'appointment_cancel',
      'billing_create', 'billing_update', 'payment_process',
      'telehealth_join', 'telehealth_leave', 'telehealth_end',
      'feedback_submit', 'feedback_update',
      'user_create', 'user_update', 'user_delete',
      'report_generate', 'report_view',
      'calendar_create', 'calendar_update', 'calendar_delete',
      'system_error', 'security_alert'
    ]
  },
  resource: {
    type: String,
    enum: ['user', 'appointment', 'billing', 'telehealth', 'feedback', 'calendar', 'report', 'system']
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed // Flexible object for additional data
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  location: {
    country: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'warning'],
    default: 'success'
  },
  sessionId: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient queries
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });
activityLogSchema.index({ resource: 1, resourceId: 1 });
activityLogSchema.index({ severity: 1, timestamp: -1 });
activityLogSchema.index({ status: 1, timestamp: -1 });

// Static method to log activity
activityLogSchema.statics.logActivity = async function(data) {
  try {
    const log = new this(data);
    await log.save();
    return log;
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw error to avoid breaking the main flow
  }
};

// Method to get activity summary
activityLogSchema.statics.getActivitySummary = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const summary = await this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        lastActivity: { $max: '$timestamp' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  return summary;
};

module.exports = mongoose.model('ActivityLog', activityLogSchema);
