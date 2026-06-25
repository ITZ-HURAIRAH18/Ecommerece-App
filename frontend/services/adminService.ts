import api from './api'

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),

  getOrders: (status?: string) =>
    api.get('/admin/orders', { params: status ? { status } : {} }),

  updateOrderStatus: (id: string, orderStatus: string, note?: string) =>
    api.put(`/admin/orders/${id}/status`, { orderStatus, note }),

  getProducts: (page?: number) =>
    api.get('/admin/products', { params: page ? { page } : {} }),

  createProduct: (data: FormData) =>
    api.post('/admin/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateProduct: (id: string, data: FormData) =>
    api.put(`/admin/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteProduct: (id: string) =>
    api.delete(`/admin/products/${id}`),

  getCategories: () => api.get('/admin/categories'),

  createCategory: (data: FormData) =>
    api.post('/admin/categories', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getBanners: () => api.get('/admin/banners'),

  createBanner: (data: FormData) =>
    api.post('/admin/banners', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteBanner: (id: string) =>
    api.delete(`/admin/banners/${id}`),

  getUsers: (page?: number) =>
    api.get('/admin/users', { params: page ? { page } : {} }),
}
