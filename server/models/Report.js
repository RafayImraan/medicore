const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['dashboard', 'appointments', 'revenue', 'patients', 'staff', 'incidents', 'tasks', 'custom']
  },
  format: {
    type: String,
    required: true,
    enum: ['csv', 'pdf', 'excel', 'json'],
    default: 'csv'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  parameters: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  fileUrl: {
    type: String
  },
  fileSize: {
    type: Number // in bytes
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Reports expire after 30 days by default
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  },
  error: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for better query performance
reportSchema.index({ status: 1 });
reportSchema.index({ generatedBy: 1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ expiresAt: 1 });

// Virtual for download URL
reportSchema.virtual('downloadUrl').get(function() {
  if (this.fileUrl) {
    return `/api/reports/download/${this._id}`;
  }
  return null;
});

// Instance method to mark as completed
reportSchema.methods.complete = function(fileUrl, fileSize) {
  this.status = 'completed';
  this.fileUrl = fileUrl;
  this.fileSize = fileSize;
  return this.save();
};

// Instance method to mark as failed
reportSchema.methods.fail = function(error) {
  this.status = 'failed';
  this.error = error;
  return this.save();
};

// Instance method to increment download count
reportSchema.methods.incrementDownload = function() {
  this.downloadCount += 1;
  return this.save();
};

// Static method to clean up expired reports
reportSchema.statics.cleanupExpired = function() {
  return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

// Static method to get reports by user
reportSchema.statics.getByUser = function(userId) {
  return this.find({ generatedBy: userId }).sort({ createdAt: -1 });
};

// Static method to get reports by type
reportSchema.statics.getByType = function(type) {
  return this.find({ type }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Report', reportSchema);
