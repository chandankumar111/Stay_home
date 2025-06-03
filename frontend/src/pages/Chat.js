import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../api';

const Chat = () => {
  const { propertyId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [property, setProperty] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    // Fetch property details
    const fetchProperty = async () => {
      try {
        const response = await api.get('/properties/' + propertyId);
        setProperty(response.data);
      } catch (error) {
        console.error('Failed to fetch property details:', error);
      }
    };
    fetchProperty();
  }, [propertyId]);

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
        const response = await api.get('/chat/' + propertyId);
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

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutesStr + ' ' + ampm;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      {property && (
        <div style={{ display: 'flex', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ flex: '0 0 200px', height: '150px', overflow: 'hidden' }}>
            <img
              src={property.photos && property.photos.length > 0 ? property.photos[0] : '/default-image.jpg'}
              alt={property.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ padding: '10px', flex: '1' }}>
            <h2 style={{ margin: '0 0 10px 0' }}>{property.title}</h2>
            <p style={{ margin: '0 0 10px 0' }}>{property.description}</p>
            <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>Price: ₹{property.price}</p>
            {property.owner && property.owner.name && (
              <p style={{ fontWeight: 'bold', margin: 0 }}>Owner: {property.owner.name}</p>
            )}
          </div>
        </div>
      )}
      <h3>Chat with Owner</h3>
      <div style={{ border: '1px solid #ccc', height: '400px', overflowY: 'auto', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              display: 'flex',
              flexDirection: msg.sender === (JSON.parse(localStorage.getItem('user'))?.id || 'guest') ? 'row-reverse' : 'row',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: msg.sender === (JSON.parse(localStorage.getItem('user'))?.id || 'guest') ? '#dcf8c6' : '#fff',
                padding: '8px 12px',
                borderRadius: '20px',
                maxWidth: '70%',
                boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ fontSize: '14px', marginBottom: '4px' }}>{msg.text}</div>
              <div style={{ fontSize: '10px', color: '#999', textAlign: 'right' }}>{formatTime(msg.timestamp)}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px', display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none' }}
        />
        <button
          onClick={sendMessage}
          style={{ marginLeft: '10px', padding: '10px 20px', borderRadius: '20px', backgroundColor: '#128C7E', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
