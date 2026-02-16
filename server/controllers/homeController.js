const HomeContent = require('../models/HomeContent');

const getHomeContent = async (req, res) => {
  try {
    const content = await HomeContent.findOne().sort({ createdAt: -1 }).lean();
    res.json(content || {});
  } catch (error) {
    console.error('Error fetching home content:', error);
    res.status(500).json({ error: 'Failed to load home content' });
  }
};

module.exports = { getHomeContent };
