import api from './api'

export const cartService = {
  getCart: () => api.get('/cart'),

  addItem: (data: { productId: string; quantity: number; selectedVariants?: Record<string, string> }) =>
    api.post('/cart/items', data),

  updateItem: (productId: string, quantity: number) =>
    api.put(`/cart/items/${productId}`, { quantity }),

  removeItem: (productId: string) =>
    api.delete(`/cart/items/${productId}`),

  clearCart: () => api.delete('/cart'),
}
