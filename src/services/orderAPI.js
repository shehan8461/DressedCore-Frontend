import api from './api';

const orderAPI = {
  // Create a new order
  createOrder: async (designId, designerId, supplierId, quoteId, amount) => {
    const response = await api.post('/api/orders', {
      designId,
      designerId,
      supplierId,
      quoteId,
      amount
    });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  },

  // Get user's orders (designer or supplier)
  getUserOrders: async () => {
    const response = await api.get('/api/orders/user');
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/api/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (orderId, paymentStatus) => {
    const response = await api.put(`/api/orders/${orderId}/payment-status`, { paymentStatus });
    return response.data;
  }
};

export default orderAPI;
