const Contact = require("../models/Contact");

// POST /api/contact - handle contact form submission
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/support-stats - return queue length and response time
exports.getSupportStats = (req, res) => {
  // For now, return static or random data; frontend merges with fake data
  const queueLength = Math.floor(Math.random() * 10);
  const responseTime = Math.floor(Math.random() * 5) + 1;
  res.json({ queueLength, responseTime });
};

// GET /api/agents - return list of support agents
exports.getAgents = (req, res) => {
  // Return empty array; frontend merges with faker data
  res.json([]);
};

// POST /api/chatbot - handle chatbot message
exports.handleChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    // For now, return a canned response
    res.json({ reply: "Sorry, our bot is busy. Please try again later." });
  } catch (error) {
    console.error("Error in chatbot:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/branches - return list of branches
exports.getBranches = (req, res) => {
  // Return empty array; frontend uses fallback location
  res.json([]);
};

// GET /api/settings - return accreditation info
exports.getAccreditations = (req, res) => {
  // Return static accreditation info
  res.json({
    accreditation: "Accredited by Joint Commission International (JCI)",
    lastUpdated: new Date().toISOString(),
  });
};
