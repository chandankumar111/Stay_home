import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/chat/conversations', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        setConversations(response.data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    };
    fetchConversations();
  }, []);

  const handleChatClick = (propertyId) => {
    navigate('/chat/' + propertyId);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Your Messages</h2>
      {conversations.length === 0 ? (
        <p>No conversations found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {conversations.map((conv) => (
            <li
              key={conv.propertyId}
              onClick={() => handleChatClick(conv.propertyId)}
              style={{
                cursor: 'pointer',
                padding: '10px',
                borderBottom: '1px solid #ccc',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                src={conv.propertyPhoto || '/default-image.jpg'}
                alt={conv.propertyTitle}
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginRight: '10px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{conv.propertyTitle}</div>
                <div style={{ fontSize: '14px', color: '#555' }}>Owner: {conv.ownerName}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                  {conv.lastMessageText ? conv.lastMessageText : 'No messages yet'}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>
                {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Messages;
