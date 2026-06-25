import api from './api'

export const orderService = {
  placeOrder: (data: {
    shippingAddress: Record<string, unknown>
    paymentMethod: string
    notes?: string
  }) => api.post('/orders', data),

  getOrders: (params?: { page?: string; limit?: string }) =>
    api.get('/orders', { params }),

  getOrder: (id: string) =>
    api.get(`/orders/${id}`),

  cancelOrder: (id: string) =>
    api.put(`/orders/${id}/cancel`),
}
