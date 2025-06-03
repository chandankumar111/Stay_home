const Chat = require('../models/Chat');

exports.getChatMessages = async (req, res) => {
  const userId = req.user.id;
  const propertyId = req.params.propertyId;
  try {
    // Find chat between user and owner for the property
    const chat = await Chat.findOne({
      participants: userId
    }).populate('messages.sender', 'name').sort({ 'messages.timestamp': 1 });

    if (!chat) {
      return res.json([]);
    }

    // Filter messages related to the property
    const messages = chat.messages.filter(msg => msg.propertyId === propertyId);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat messages' });
  }
};

exports.getUserConversations = async (req, res) => {
  const userId = req.user.id;
  try {
    // Find all chats where user is a participant
    const chats = await Chat.find({
      participants: userId
    }).populate('participants', 'name');

    // Map to conversations with other participant info and last message
    const conversations = chats.map(chat => {
      const otherParticipant = chat.participants.find(p => p._id.toString() !== userId);
      const lastMessage = chat.messages[chat.messages.length - 1];
      return {
        chatId: chat._id,
        participantId: otherParticipant ? otherParticipant._id : null,
        participantName: otherParticipant ? otherParticipant.name : 'Unknown',
        lastMessageText: lastMessage ? lastMessage.message : '',
        lastMessageTime: lastMessage ? lastMessage.timestamp : null,
        propertyId: chat.propertyId || null,
        ownerId: otherParticipant ? otherParticipant._id : null
      };
    });

    res.json(conversations);
  } catch (error) {
    console.error('Failed to fetch user conversations:', error);
    res.status(500).json({ error: 'Failed to fetch user conversations' });
  }
};

exports.getUserConversations = async (req, res) => {
  const userId = req.user.id;
  try {
    // Find all chats where user is a participant
    const chats = await Chat.find({
      participants: userId
    }).populate('participants', 'name');

    // Map to conversations with other participant info and last message
    const conversations = chats.map(chat => {
      const otherParticipant = chat.participants.find(p => p._id.toString() !== userId);
      const lastMessage = chat.messages[chat.messages.length - 1];
      return {
        chatId: chat._id,
        participantId: otherParticipant ? otherParticipant._id : null,
        participantName: otherParticipant ? otherParticipant.name : 'Unknown',
        lastMessageText: lastMessage ? lastMessage.message : '',
        lastMessageTime: lastMessage ? lastMessage.timestamp : null
      };
    });

    res.json(conversations);
  } catch (error) {
    console.error('Failed to fetch user conversations:', error);
    res.status(500).json({ error: 'Failed to fetch user conversations' });
  }
};
