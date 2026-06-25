import { create } from 'zustand'

interface Notification {
  _id: string
  title: string
  body: string
  type: 'order' | 'promotion' | 'system'
  isRead: boolean
  createdAt: string
}

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  setNotifications: (notifications: Notification[]) => void
  markAsRead: (id: string) => void
  addNotification: (notification: Notification) => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  setNotifications: (notifications) => {
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    })
  },

  markAsRead: (id) => {
    const notifications = get().notifications.map((n) =>
      n._id === id ? { ...n, isRead: true } : n
    )
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    })
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    }))
  },
}))
