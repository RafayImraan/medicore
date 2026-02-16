const DepartmentAnalytics = require('../models/DepartmentAnalytics');
const DepartmentEngagement = require('../models/DepartmentEngagement');
const DepartmentChatLog = require('../models/DepartmentChatLog');

const getUserId = (req) => req.user?._id || null;

const upsertAnalytics = async (departmentId, field) => {
  if (!departmentId) return;
  await DepartmentAnalytics.updateOne(
    { departmentId },
    { $inc: { [field]: 1 } },
    { upsert: true }
  );
};

const logAction = async (req, res, { action, analyticsField }) => {
  try {
    const { departmentId, meta } = req.body;
    await DepartmentEngagement.create({
      userId: getUserId(req),
      departmentId,
      action,
      meta: meta || {},
      source: 'departments'
    });
    if (analyticsField) {
      await upsertAnalytics(departmentId, analyticsField);
    }
    res.json({ success: true });
  } catch (error) {
    console.error(`Department ${action} error:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.logView = (req, res) => logAction(req, res, { action: 'view', analyticsField: 'views' });
exports.logCompare = (req, res) => logAction(req, res, { action: 'compare', analyticsField: 'compares' });
exports.logFavorite = (req, res) => logAction(req, res, { action: 'favorite', analyticsField: 'favorites' });
exports.logContact = (req, res) => logAction(req, res, { action: 'contact', analyticsField: 'contacts' });
exports.logDirections = (req, res) => logAction(req, res, { action: 'directions', analyticsField: 'directions' });
exports.logBooking = (req, res) => logAction(req, res, { action: 'booking', analyticsField: 'bookings' });
exports.logSearch = (req, res) => logAction(req, res, { action: 'search', analyticsField: 'searches' });

exports.logChat = async (req, res) => {
  try {
    const { departmentId, messages = [] } = req.body;
    const chat = await DepartmentChatLog.create({
      userId: getUserId(req),
      departmentId,
      messages,
      source: 'departments'
    });
    await upsertAnalytics(departmentId, 'chats');
    res.json(chat);
  } catch (error) {
    console.error('Department chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
