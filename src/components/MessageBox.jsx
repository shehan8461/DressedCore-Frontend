import { useState, useEffect, useRef } from 'react';
import messageAPI from '../services/messageAPI';
import '../styles/messages.css';

const MessageBox = ({ userId, userName, designId = null, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadConversation();
    const interval = setInterval(loadConversation, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [userId, designId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversation = async () => {
    try {
      setLoading(true);
      const data = await messageAPI.getConversation(userId, designId);
      setMessages(data);
      
      // Mark unread messages as read
      const unreadMessages = data.filter(m => 
        m.receiverId === currentUser.id && !m.isRead
      );
      for (const msg of unreadMessages) {
        await messageAPI.markAsRead(msg.messageId);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await messageAPI.sendMessage(userId, newMessage, designId);
      setNewMessage('');
      await loadConversation();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="message-box-overlay">
      <div className="message-box">
        <div className="message-box-header">
          <div>
            <h3>💬 Chat with {userName}</h3>
            {designId && <p className="design-context">Design #{designId}</p>}
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="messages-container">
          {loading && messages.length === 0 ? (
            <div className="loading">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="no-messages">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.messageId}
                className={`message ${
                  msg.senderId === currentUser.id ? 'sent' : 'received'
                }`}
              >
                <div className="message-content">
                  <p>{msg.content}</p>
                  <span className="message-time">{formatTime(msg.createdAt)}</span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-input-form" onSubmit={handleSend}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={sending}
          />
          <button type="submit" disabled={sending || !newMessage.trim()}>
            {sending ? '⏳' : '📤'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageBox;
