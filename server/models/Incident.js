const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Equipment Failure', 'Medication Shortage', 'Staff Shortage', 'IT Outage', 'Security Incident', 'Patient Safety', 'Other']
  },
  severity: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
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
  location: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: function() {
      // Auto-set priority based on severity
      const severityPriority = { 'Low': 'Low', 'Medium': 'Medium', 'High': 'High', 'Critical': 'Urgent' };
      return severityPriority[this.severity] || 'Medium';
    }
  },
  category: {
    type: String,
    enum: ['Technical', 'Medical', 'Administrative', 'Security', 'Facility'],
    default: 'Technical'
  },
  resolution: {
    type: String,
    trim: true
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for better query performance
incidentSchema.index({ status: 1, severity: 1 });
incidentSchema.index({ reportedBy: 1 });
incidentSchema.index({ assignedTo: 1 });
incidentSchema.index({ createdAt: -1 });
incidentSchema.index({ type: 1 });

// Virtual for duration if resolved
incidentSchema.virtual('duration').get(function() {
  if (this.resolvedAt && this.createdAt) {
    return this.resolvedAt - this.createdAt;
  }
  return null;
});

// Instance method to resolve incident
incidentSchema.methods.resolve = function(resolution, resolvedBy) {
  this.status = 'Resolved';
  this.resolution = resolution;
  this.resolvedAt = new Date();
  this.resolvedBy = resolvedBy;
  return this.save();
};

// Static method to get incidents by status
incidentSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get incidents by severity
incidentSchema.statics.getBySeverity = function(severity) {
  return this.find({ severity }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Incident', incidentSchema);
