import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import api from '../api';

const Chat = ({ propertyId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    // Connect to socket.io server
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001');

    // Join room for property chat
    socketRef.current.emit('joinRoom', { propertyId });

    // Listen for incoming messages
    socketRef.current.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Fetch chat history
    const fetchChatHistory = async () => {
      try {
        const response = await api.get(`/chat/${propertyId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    fetchChatHistory();

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [propertyId]);

  const sendMessage = () => {
    if (input.trim() === '') return;
    const message = {
      propertyId,
      text: input,
      sender: JSON.parse(localStorage.getItem('user'))?.id || 'guest',
      timestamp: new Date(),
    };
    socketRef.current.emit('sendMessage', message);
    setMessages((prev) => [...prev, message]);
    setInput('');
  };

  return (
    <div>
      <h3>Live Chat</h3>
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}</strong>: {msg.text} <em>({new Date(msg.timestamp).toLocaleTimeString()})</em>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
