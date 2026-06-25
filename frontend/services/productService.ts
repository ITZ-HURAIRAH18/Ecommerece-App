import api from './api'

export const productService = {
  getProducts: (params?: Record<string, string>) =>
    api.get('/products', { params }),

  getProduct: (id: string) =>
    api.get(`/products/${id}`),

  getFeatured: () =>
    api.get('/products/featured'),

  getNewArrivals: () =>
    api.get('/products/new-arrivals'),

  getRelated: (id: string) =>
    api.get(`/products/${id}/related`),

  search: (params: Record<string, string>) =>
    api.get('/search', { params }),

  getSuggestions: (q: string) =>
    api.get('/search/suggestions', { params: { q } }),
}
