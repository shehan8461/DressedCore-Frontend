import api from './api';

const paymentAPI = {
  // Calculate platform fee
  calculateFee: async (amount) => {
    const response = await api.post('/api/payments/calculate-fee', { amount });
    return response.data;
  },

  // Process payment
  processPayment: async (orderId, amount, paymentMethod) => {
    const response = await api.post('/api/payments/process', {
      orderId,
      amount,
      paymentMethod
    });
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    const response = await api.get(`/api/payments/${paymentId}/status`);
    return response.data;
  },

  // Get user payment history
  getUserPayments: async () => {
    const response = await api.get('/api/payments/user');
    return response.data;
  },

  // Refund payment
  refundPayment: async (paymentId, amount, reason) => {
    const response = await api.post(`/api/payments/${paymentId}/refund`, {
      amount,
      reason
    });
    return response.data;
  },

  // Get payment transactions
  getPaymentTransactions: async (paymentId) => {
    const response = await api.get(`/api/payments/${paymentId}/transactions`);
    return response.data;
  }
};

export default paymentAPI;
