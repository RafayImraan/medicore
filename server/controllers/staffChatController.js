const StaffMessage = require('../models/StaffMessage');

const listMessages = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    const messages = await StaffMessage.find()
      .sort({ createdAt: -1 })
      .limit(limitNumber);

    res.json(messages);
  } catch (error) {
    console.error('Error fetching staff chat messages:', error);
    res.status(500).json({ error: 'Failed to load staff chat messages' });
  }
};

const createMessage = async (req, res) => {
  try {
    const { senderName, role, department, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const payload = {
      senderName: senderName || req.user?.name || 'Staff Member',
      role: role || req.user?.role || 'Staff',
      department: department || 'General',
      message
    };

    const created = await StaffMessage.create(payload);
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating staff chat message:', error);
    res.status(500).json({ error: 'Failed to create staff chat message' });
  }
};

module.exports = {
  listMessages,
  createMessage
};
