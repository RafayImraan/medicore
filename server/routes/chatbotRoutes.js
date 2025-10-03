const express = require('express');
const router = express.Router();
const {
  sendChatMessage,
  getChatHistory,
  clearChatHistory
} = require('../controllers/chatbotController');

// Send chat message
router.post('/chatbot', sendChatMessage);

// Get chat history
router.get('/chatbot/history', getChatHistory);

// Clear chat history
router.delete('/chatbot/history', clearChatHistory);

module.exports = router;
