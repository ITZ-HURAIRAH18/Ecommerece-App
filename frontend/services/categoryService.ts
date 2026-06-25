import api from './api'

export const categoryService = {
  getAll: () => api.get('/categories'),

  create: (data: { name: string; description?: string; image?: string; icon?: string }) =>
    api.post('/admin/categories', data),
}
