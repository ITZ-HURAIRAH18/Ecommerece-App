import api from './api'

export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
}
