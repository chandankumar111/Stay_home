const Chat = require('../models/Chat');

// Get chat messages for a property
exports.getChatMessages = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const messages = await Chat.find({ propertyId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save a new chat message
exports.saveChatMessage = async (message) => {
  try {
    const chatMessage = new Chat(message);
    await chatMessage.save();
  } catch (error) {
    console.error('Save chat message error:', error);
  }
};
