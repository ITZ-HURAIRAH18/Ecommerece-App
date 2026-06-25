import api from './api'

export const orderService = {
  placeOrder: (data: {
    shippingAddress: Record<string, unknown>
    paymentMethod: string
    notes?: string
  }) => api.post('/orders', data),

  getOrders: (params?: { page?: string; limit?: string }) =>
    api.get('/orders', { params }),

  getOrder: async (id: string) => {
    const response = await api.get(`/orders/${id}`)
    return response.data.data
  },

  cancelOrder: (id: string) =>
    api.put(`/orders/${id}/cancel`),
}
