const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['bug_report', 'feature_request', 'general_feedback', 'complaint', 'praise'],
    required: true
  },
  category: {
    type: String,
    enum: ['ui/ux', 'functionality', 'performance', 'security', 'billing', 'appointments', 'telehealth', 'other'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_review', 'in_progress', 'resolved', 'closed', 'rejected'],
    default: 'open'
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolution: {
    type: String,
    trim: true
  },
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  metadata: {
    userAgent: String,
    url: String,
    browser: String,
    device: String,
    ipAddress: String
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
feedbackSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ type: 1, status: 1 });
feedbackSchema.index({ category: 1 });
feedbackSchema.index({ status: 1, priority: -1 });
feedbackSchema.index({ assignedTo: 1 });

// Virtual for days open
feedbackSchema.virtual('daysOpen').get(function() {
  if (this.status === 'resolved' || this.status === 'closed') {
    return Math.floor((this.resolvedAt - this.createdAt) / (1000 * 60 * 60 * 24));
  }
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to assign feedback
feedbackSchema.methods.assignTo = function(userId) {
  this.assignedTo = userId;
  this.status = 'in_review';
  return this.save();
};

// Method to resolve feedback
feedbackSchema.methods.resolve = function(resolution, resolvedBy) {
  this.status = 'resolved';
  this.resolution = resolution;
  this.resolvedBy = resolvedBy;
  this.resolvedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Feedback', feedbackSchema);
