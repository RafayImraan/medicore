const Feedback = require('../models/Feedback');
const User = require('../models/User');

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { type, category, title, description, rating, tags } = req.body;

    const feedback = new Feedback({
      userId: req.user._id,
      type,
      category,
      title,
      description,
      rating,
      tags: tags || [],
      metadata: {
        userAgent: req.get('User-Agent'),
        url: req.get('Referer'),
        ipAddress: req.ip
      }
    });

    await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's feedback
exports.getUserFeedback = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const feedback = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments(query);

    res.json({
      feedback,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all feedback (admin)
exports.getAllFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, category, priority } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const feedback = await Feedback.find(query)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments(query);

    res.json({
      feedback,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update feedback status
exports.updateFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { status, priority, assignedTo, resolution } = req.body;

    const updateData = { status, priority };
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (resolution) {
      updateData.resolution = resolution;
      updateData.resolvedBy = req.user._id;
      updateData.resolvedAt = new Date();
    }

    const feedback = await Feedback.findByIdAndUpdate(feedbackId, updateData, { new: true })
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email')
      .populate('resolvedBy', 'name email');

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({
      message: 'Feedback updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get feedback statistics
exports.getFeedbackStats = async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const typeStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const avgRating = await Feedback.aggregate([
      { $match: { rating: { $exists: true } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      statusStats: stats,
      typeStats,
      categoryStats,
      averageRating: avgRating[0]?.avgRating || 0
    });
  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
