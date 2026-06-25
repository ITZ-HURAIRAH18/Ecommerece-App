import { create } from 'zustand'
import { authService } from '../services/authService'
import { saveToken, saveRefreshToken, clearTokens, getToken, getRefreshToken } from '../utils/storage'

interface User {
  _id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface AuthStore {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  restoreSession: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const { data } = await authService.login({ email, password })
    const { accessToken, refreshToken, user } = data.data
    await saveToken(accessToken)
    await saveRefreshToken(refreshToken)
    set({ user, accessToken, isAuthenticated: true })
  },

  register: async (name, email, password) => {
    await authService.register({ name, email, password })
  },

  logout: async () => {
    try {
      const refreshToken = await getRefreshToken()
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch {
    } finally {
      await clearTokens()
      set({ user: null, accessToken: null, isAuthenticated: false })
    }
  },

  restoreSession: async () => {
    try {
      const token = await getToken()
      if (token) {
        set({ accessToken: token, isAuthenticated: true })
      }
    } catch {
    } finally {
      set({ isLoading: false })
    }
  },
}))
