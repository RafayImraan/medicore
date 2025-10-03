const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const supportController = require("../controllers/supportController");
const chatbotController = require("../controllers/chatbotController");
const branchController = require("../controllers/branchController");
const settingsController = require("../controllers/settingsController");

// POST /api/contact - handle contact form submission
router.post("/contact", contactController.submitContactForm);

// GET /api/support-stats - return queue length and response time
router.get("/support-stats", supportController.getSupportStats);

// GET /api/agents - return list of support agents
router.get("/agents", supportController.getAgents);

// POST /api/chatbot - handle chatbot message
router.post("/chatbot", chatbotController.sendChatMessage);

// GET /api/branches - return list of branches
router.get("/branches", branchController.getBranches);

// GET /api/settings - return accreditation info
router.get("/settings", settingsController.getAccreditations);

module.exports = router;
