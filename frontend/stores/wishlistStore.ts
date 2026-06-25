import { create } from 'zustand'
import { wishlistService } from '../services/wishlistService'

interface WishlistStore {
  items: string[]
  isLoading: boolean
  fetchWishlist: () => Promise<void>
  toggle: (productId: string) => Promise<void>
  isWishlisted: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true })
    try {
      const { data } = await wishlistService.getWishlist()
      const wishlist = data.data
      set({
        items: (wishlist.products || []).map(
          (p: { _id: string }) => p._id || p
        ),
      })
    } catch {
    } finally {
      set({ isLoading: false })
    }
  },

  toggle: async (productId) => {
    const prev = get().items
    const exists = prev.includes(productId)
    set({
      items: exists
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    })
    try {
      await wishlistService.toggle(productId)
    } catch {
      set({ items: prev })
    }
  },

  isWishlisted: (productId) => {
    return get().items.includes(productId)
  },
}))
