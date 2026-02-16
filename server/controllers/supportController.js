const Agent = require('../models/Agent');

// Get support statistics
const getSupportStats = async (req, res) => {
  try {
    const agents = await Agent.find({});
    const totalAgents = agents.length;
    const activeAgents = agents.filter((agent) => agent.available).length;
    const queueLength = agents.reduce((sum, agent) => sum + (agent.activeChats || 0), 0);
    const responseTime = activeAgents > 0 ? Math.max(1, Math.ceil(queueLength / activeAgents)) : 0;

    res.json({
      queueLength,
      responseTime,
      activeAgents,
      totalAgents,
      status: 'success'
    });
  } catch (error) {
    console.error('Error fetching support stats:', error);
    res.status(500).json({
      queueLength: 0,
      responseTime: 0,
      activeAgents: 0,
      totalAgents: 0,
      status: 'error'
    });
  }
};

// Get all support agents
const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({}).select('name avatar available specialization languages rating');

    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to load agents' });
  }
};

// Get agent by ID
const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update agent availability
const updateAgentAvailability = async (req, res) => {
  try {
    const { available } = req.body;
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { available, lastActive: new Date() },
      { new: true }
    );
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    console.error('Error updating agent availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSupportStats,
  getAgents,
  getAgentById,
  updateAgentAvailability
};
