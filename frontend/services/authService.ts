import api from './api'

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    _id: string
    name: string
    email: string
    role: string
    avatar?: string
  }
}

export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),

  verifyEmail: (otp: string) =>
    api.post('/auth/verify-email', { otp }),

  login: (data: { email: string; password: string }) =>
    api.post<{ data: LoginResponse }>('/auth/login', data),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),
}
