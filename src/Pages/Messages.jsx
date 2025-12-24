import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import messageAPI from '../services/messageAPI';
import MessageBox from '../components/MessageBox';
import '../styles/messages.css';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const messages = await messageAPI.getUserMessages();
      
      // Group messages by conversation partner
      const grouped = {};
      messages.forEach(msg => {
        const partnerId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
        if (!grouped[partnerId]) {
          grouped[partnerId] = {
            partnerId,
            partnerName: msg.senderId === user.id ? 'User' : 'User',
            messages: [],
            lastMessage: msg,
            unreadCount: 0
          };
        }
        grouped[partnerId].messages.push(msg);
        if (msg.receiverId === user.id && !msg.isRead) {
          grouped[partnerId].unreadCount++;
        }
      });

      setConversations(Object.values(grouped).sort((a, b) => 
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
      ));
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="messages-page">
      <h1>💬 Messages</h1>
      
      {loading ? (
        <div className="loading">Loading conversations...</div>
      ) : conversations.length === 0 ? (
        <div className="no-messages">
          <p>No messages yet. Start a conversation!</p>
        </div>
      ) : (
        <div className="messages-list">
          {conversations.map((conv) => (
            <div
              key={conv.partnerId}
              className={`message-item ${conv.unreadCount > 0 ? 'unread' : ''}`}
              onClick={() => setSelectedChat(conv)}
            >
              <div className="message-item-header">
                <h4>
                  {conv.partnerName}
                  {conv.unreadCount > 0 && (
                    <span className="unread-badge">{conv.unreadCount}</span>
                  )}
                </h4>
                <span className="message-item-time">
                  {formatTime(conv.lastMessage.createdAt)}
                </span>
              </div>
              <p className="message-item-preview">
                {conv.lastMessage.senderId === user.id ? 'You: ' : ''}
                {conv.lastMessage.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedChat && (
        <MessageBox
          userId={selectedChat.partnerId}
          userName={selectedChat.partnerName}
          designId={selectedChat.lastMessage.designId}
          onClose={() => {
            setSelectedChat(null);
            loadMessages();
          }}
        />
      )}
    </div>
  );
};

export default Messages;
