const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateJWT } = require('../middleware/auth');

// Get chat messages for a property
router.get('/:propertyId', authenticateJWT, chatController.getChatMessages);

module.exports = router;
