const express = require('express');
const { listMessages, createMessage } = require('../controllers/staffChatController');

const router = express.Router();

router.get('/', listMessages);
router.post('/', createMessage);

module.exports = router;
