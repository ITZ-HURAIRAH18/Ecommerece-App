import { create } from 'zustand'
import { cartService } from '../services/cartService'

interface CartItem {
  product: string
  name: string
  image: string
  price: number
  quantity: number
  selectedVariants?: Record<string, string>
}

interface CartStore {
  items: CartItem[]
  total: number
  itemCount: number
  isLoading: boolean
  fetchCart: () => Promise<void>
  addItem: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQty: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true })
    try {
      const { data } = await cartService.getCart()
      const cart = data.data
      set({
        items: cart.items || [],
        total: cart.total || 0,
        itemCount: cart.itemCount || 0,
      })
    } catch {
    } finally {
      set({ isLoading: false })
    }
  },

  addItem: async (productId, quantity, selectedVariants) => {
    const prevItems = get().items
    try {
      await cartService.addItem({ productId, quantity, selectedVariants })
      const { data } = await cartService.getCart()
      const cart = data.data
      set({
        items: cart.items || [],
        total: cart.total || 0,
        itemCount: cart.itemCount || 0,
      })
    } catch {
      set({ items: prevItems })
    }
  },

  removeItem: async (productId) => {
    const prevItems = get().items
    set({ items: prevItems.filter((i) => i.product !== productId) })
    try {
      await cartService.removeItem(productId)
      const { data } = await cartService.getCart()
      const cart = data.data
      set({
        items: cart.items || [],
        total: cart.total || 0,
        itemCount: cart.itemCount || 0,
      })
    } catch {
      set({ items: prevItems })
    }
  },

  updateQty: async (productId, quantity) => {
    const prevItems = get().items
    set({
      items: get().items.map((i) =>
        i.product === productId ? { ...i, quantity } : i
      ),
    })
    try {
      await cartService.updateItem(productId, quantity)
    } catch {
      set({ items: prevItems })
    }
  },

  clearCart: async () => {
    set({ items: [], total: 0, itemCount: 0 })
    try {
      await cartService.clearCart()
    } catch {
    }
  },
}))
