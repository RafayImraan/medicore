const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    required: true,
    enum: ['todo', 'in-progress', 'completed', 'cancelled'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['maintenance', 'administrative', 'medical', 'technical', 'security', 'other'],
    default: 'other'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for better query performance
taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ category: 1 });

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  if (this.dueDate && this.status !== 'completed' && this.status !== 'cancelled') {
    return new Date() > this.dueDate;
  }
  return false;
});

// Instance method to complete task
taskSchema.methods.complete = function(completedBy) {
  this.status = 'completed';
  this.completedAt = new Date();
  this.completedBy = completedBy;
  return this.save();
};

// Instance method to add comment
taskSchema.methods.addComment = function(text, author) {
  this.comments.push({
    text,
    author,
    createdAt: new Date()
  });
  return this.save();
};

// Static method to get tasks by status
taskSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get overdue tasks
taskSchema.statics.getOverdue = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $nin: ['completed', 'cancelled'] }
  }).sort({ dueDate: 1 });
};

// Static method to get tasks assigned to user
taskSchema.statics.getAssignedTo = function(userId) {
  return this.find({ assignedTo: userId }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Task', taskSchema);
