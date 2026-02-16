const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

// Log activity (internal use)
exports.logActivity = async (data) => {
  return await ActivityLog.logActivity(data);
};

// Public log endpoint (no auth required)
exports.logPublicActivity = async (req, res) => {
  try {
    const {
      action = 'ui_click',
      resource = 'ui',
      description = 'UI interaction',
      details = {},
      severity = 'low',
      status = 'success'
    } = req.body || {};

    await ActivityLog.logActivity({
      action,
      resource,
      description,
      details,
      severity,
      status,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Log public activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user activity logs
exports.getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, action, resource, startDate, endDate } = req.query;

    const query = { userId };

    if (action) query.action = action;
    if (resource) query.resource = resource;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const activities = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'name email role');

    const total = await ActivityLog.countDocuments(query);

    res.json({
      activities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all activity logs (admin)
exports.getAllActivity = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, action, resource, severity, status, startDate, endDate } = req.query;

    const query = {};

    if (userId) query.userId = userId;
    if (action) query.action = action;
    if (resource) query.resource = resource;
    if (severity) query.severity = severity;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const activities = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'name email role');

    const total = await ActivityLog.countDocuments(query);

    res.json({
      activities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get activity summary
exports.getActivitySummary = async (req, res) => {
  try {
    const { userId, days = 30 } = req.query;

    const summary = await ActivityLog.getActivitySummary(userId || req.user._id, parseInt(days));

    res.json({ summary });
  } catch (error) {
    console.error('Get activity summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get activity statistics
exports.getActivityStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.timestamp = {};
      if (startDate) dateFilter.timestamp.$gte = new Date(startDate);
      if (endDate) dateFilter.timestamp.$lte = new Date(endDate);
    }

    // Action statistics
    const actionStats = await ActivityLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Resource statistics
    const resourceStats = await ActivityLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$resource',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Severity statistics
    const severityStats = await ActivityLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    // Status statistics
    const statusStats = await ActivityLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Daily activity trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo },
          ...dateFilter.timestamp
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      actionStats,
      resourceStats,
      severityStats,
      statusStats,
      dailyStats
    });
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get security alerts
exports.getSecurityAlerts = async (req, res) => {
  try {
    const alerts = await ActivityLog.find({
      severity: { $in: ['high', 'critical'] },
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    })
      .sort({ timestamp: -1 })
      .populate('userId', 'name email role')
      .limit(50);

    res.json({ alerts });
  } catch (error) {
    console.error('Get security alerts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
