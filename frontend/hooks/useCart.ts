import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'

export function useCart() {
  const { isAuthenticated } = useAuthStore()
  const store = useCartStore()

  useEffect(() => {
    if (isAuthenticated) {
      store.fetchCart()
    }
  }, [isAuthenticated])

  return store
}
