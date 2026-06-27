import { create } from 'zustand'

interface Address {
  label: string
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

interface CheckoutStore {
  address: Address | null
  setAddress: (address: Address) => void
  clearAddress: () => void
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  address: null,
  setAddress: (address) => set({ address }),
  clearAddress: () => set({ address: null }),
}))
