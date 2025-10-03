const Agent = require('../models/Agent');

// Get support statistics
const getSupportStats = async (req, res) => {
  try {
    // Get queue length (simulated - in real app, this would come from a queue system)
    const queueLength = Math.floor(Math.random() * 15) + 1;

    // Get average response time (simulated)
    const responseTime = Math.floor(Math.random() * 10) + 2;

    // Get total active agents
    const activeAgents = await Agent.countDocuments({ available: true });

    // Get total agents
    const totalAgents = await Agent.countDocuments();

    res.json({
      queueLength,
      responseTime,
      activeAgents,
      totalAgents,
      status: 'success'
    });
  } catch (error) {
    console.error('Error fetching support stats:', error);
    // Fallback data
    res.json({
      queueLength: Math.floor(Math.random() * 10) + 1,
      responseTime: Math.floor(Math.random() * 5) + 1,
      activeAgents: 3,
      totalAgents: 5,
      status: 'fallback'
    });
  }
};

// Get all support agents
const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({}).select('name avatar available specialization languages rating');

    if (agents.length === 0) {
      // Return mock data if no agents in database
      const mockAgents = [
        {
          name: 'Sarah Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          available: true,
          specialization: 'General',
          languages: ['English', 'Urdu'],
          rating: 4.8
        },
        {
          name: 'Ahmed Khan',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
          available: true,
          specialization: 'Technical',
          languages: ['English', 'Urdu', 'Sindhi'],
          rating: 4.6
        },
        {
          name: 'Maria Rodriguez',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
          available: false,
          specialization: 'Billing',
          languages: ['English', 'Spanish'],
          rating: 4.9
        }
      ];
      return res.json(mockAgents);
    }

    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    // Fallback mock data
    const fallbackAgents = [
      {
        name: 'Support Agent 1',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agent1',
        available: Math.random() > 0.3,
        specialization: 'General',
        languages: ['English'],
        rating: 4.5
      },
      {
        name: 'Support Agent 2',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agent2',
        available: Math.random() > 0.3,
        specialization: 'Technical',
        languages: ['English', 'Urdu'],
        rating: 4.7
      },
      {
        name: 'Support Agent 3',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agent3',
        available: Math.random() > 0.3,
        specialization: 'Billing',
        languages: ['English'],
        rating: 4.3
      }
    ];
    res.json(fallbackAgents);
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
