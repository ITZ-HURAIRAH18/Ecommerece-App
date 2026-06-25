import { useEffect } from 'react'
import { useRouter, useSegments } from 'expo-router'
import { useAuthStore } from '../stores/authStore'

export function useAuth() {
  const { isAuthenticated, isLoading, restoreSession } = useAuthStore()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    restoreSession()
  }, [])

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)')
    }
  }, [isAuthenticated, isLoading, segments])

  return useAuthStore()
}
