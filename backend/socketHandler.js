const Chat = require('./models/Chat');

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', ({ roomId }) => {
      socket.join(roomId);
      console.log('Socket ' + socket.id + ' joined room ' + roomId);
    });

    socket.on('sendMessage', async (data) => {
      try {
        const { senderId, receiverId, message } = data;
        // Find existing chat or create new
        let chat = await Chat.findOne({
          participants: { $all: [senderId, receiverId] }
        });
        if (!chat) {
          chat = new Chat({
            participants: [senderId, receiverId],
            messages: []
          });
        }
        chat.messages.push({
          sender: senderId,
          receiver: receiverId,
          message,
          timestamp: new Date()
        });
        await chat.save();

        // Emit message to room
        io.to(data.roomId).emit('message', {
          senderId,
          message,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error saving or emitting message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

module.exports = socketHandler;
