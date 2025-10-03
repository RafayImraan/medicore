const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['appointment', 'patient', 'prescription', 'billing', 'report', 'system', 'security'],
    default: 'system'
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'resourceType'
  },
  resourceType: {
    type: String,
    enum: ['Appointment', 'Patient', 'Prescription', 'Billing', 'Report', 'User']
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed // Additional data specific to the notification type
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient queries
notificationSchema.index({ userId: 1, timestamp: -1 });
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ type: 1, timestamp: -1 });
notificationSchema.index({ severity: 1, timestamp: -1 });

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  try {
    const notification = new this(data);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
};

// Static method to get unread notifications count
notificationSchema.statics.getUnreadCount = async function(userId) {
  try {
    return await this.countDocuments({ userId, read: false });
  } catch (error) {
    console.error('Failed to get unread count:', error);
    return 0;
  }
};

// Method to mark as read
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  this.readAt = new Date();
  await this.save();
  return this;
};

module.exports = mongoose.model('Notification', notificationSchema);
