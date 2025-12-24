import api from './api';

const messageAPI = {
  // Send a message
  sendMessage: async (receiverId, content, designId = null, quoteId = null) => {
    const response = await api.post('/api/messages', {
      receiverId,
      content,
      designId,
      quoteId
    });
    return response.data;
  },

  // Get conversation with a specific user
  getConversation: async (userId, designId = null) => {
    const params = designId ? { designId } : {};
    const response = await api.get(`/api/messages/conversation/${userId}`, { params });
    return response.data;
  },

  // Get all messages for current user
  getUserMessages: async () => {
    const response = await api.get('/api/messages/user');
    return response.data;
  },

  // Mark message as read
  markAsRead: async (messageId) => {
    const response = await api.put(`/api/messages/${messageId}/read`);
    return response.data;
  },

  // Get unread message count
  getUnreadCount: async () => {
    const response = await api.get('/api/messages/unread/count');
    return response.data;
  },

  // Send email notification
  sendEmail: async (toEmail, toName, subject, body) => {
    const response = await api.post('/api/email/send', {
      toEmail,
      toName,
      subject,
      body
    });
    return response.data;
  }
};

export default messageAPI;
