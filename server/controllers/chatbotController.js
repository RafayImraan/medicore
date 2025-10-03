// Simple chatbot responses based on keywords
const responses = {
  greeting: [
    "Hello! How can I help you today?",
    "Hi there! I'm here to assist you.",
    "Welcome! What can I do for you?"
  ],
  appointment: [
    "I'd be happy to help you schedule an appointment. You can book online through our website or call us at +92 21 111 911 911.",
    "For appointments, please visit our booking page or contact our reception at the main number.",
    "You can schedule an appointment by calling +92 21 111 911 911 or using our online booking system."
  ],
  emergency: [
    "For medical emergencies, please call our emergency line at +92 21 111 786 786 immediately.",
    "If this is a medical emergency, please dial +92 21 111 786 786 right away.",
    "Emergency services are available 24/7. Please call +92 21 111 786 786."
  ],
  billing: [
    "For billing inquiries, please contact our billing department at billing@medicore.org or call +92 21 111 911 911.",
    "Billing questions can be directed to our finance team. Email: billing@medicore.org",
    "For payment and billing information, reach out to our billing office."
  ],
  location: [
    "Our main location is at Stadium Road, Karachi, Pakistan.",
    "You can find us at Stadium Road, Karachi. We also have branches throughout the city.",
    "Our address is Stadium Road, Karachi, Pakistan 74800."
  ],
  hours: [
    "We're open Monday through Friday from 9:00 AM to 5:00 PM, Saturday from 9:00 AM to 2:00 PM, and closed on Sundays.",
    "Our operating hours are: Mon-Fri 9AM-5PM, Sat 9AM-2PM, Sun Closed.",
    "We operate from 9:00 AM to 5:00 PM on weekdays and 9:00 AM to 2:00 PM on Saturdays."
  ],
  default: [
    "I'm here to help! Could you please provide more details about your question?",
    "I'd be happy to assist you. Can you tell me more about what you need?",
    "Let me help you with that. Could you please elaborate on your inquiry?"
  ]
};

const analyzeMessage = (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'greeting';
  }
  if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
    return 'appointment';
  }
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
    return 'emergency';
  }
  if (lowerMessage.includes('bill') || lowerMessage.includes('payment') || lowerMessage.includes('cost')) {
    return 'billing';
  }
  if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
    return 'location';
  }
  if (lowerMessage.includes('hour') || lowerMessage.includes('time') || lowerMessage.includes('open')) {
    return 'hours';
  }

  return 'default';
};

const sendChatMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        reply: "I didn't receive a valid message. Please try again."
      });
    }

    // Analyze the message and get appropriate response category
    const category = analyzeMessage(message);

    // Get random response from the category
    const categoryResponses = responses[category];
    const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

    // Simulate processing delay
    setTimeout(() => {
      res.json({
        reply: randomResponse,
        category: category,
        timestamp: new Date().toISOString()
      });
    }, 500 + Math.random() * 1000); // 500ms to 1.5s delay

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      reply: "I'm experiencing technical difficulties. Please try again later or contact support.",
      error: true
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    // In a real implementation, this would fetch from a database
    // For now, return empty history
    res.json({
      history: [],
      total: 0
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const clearChatHistory = async (req, res) => {
  try {
    // In a real implementation, this would clear chat history from database
    res.json({
      message: 'Chat history cleared successfully',
      cleared: true
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendChatMessage,
  getChatHistory,
  clearChatHistory
};
