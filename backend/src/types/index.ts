import { Request } from 'express'
import { Document, Types } from 'mongoose'

export interface IUser extends Document {
  _id: Types.ObjectId
  name: string
  email: string
  phone?: string
  passwordHash: string
  avatar?: string
  role: 'customer' | 'admin'
  addresses: IAddress[]
  savedPaymentMethods: IPaymentMethod[]
  pushTokens: string[]
  refreshTokens: string[]
  isEmailVerified: boolean
  wishlist: Types.ObjectId[]
  recentlyViewed: Array<{ productId: Types.ObjectId; viewedAt: Date }>
  createdAt: Date
  updatedAt: Date
}

export interface IAddress {
  _id?: Types.ObjectId
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

export interface IPaymentMethod {
  _id?: Types.ObjectId
  type: 'card' | 'wallet'
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
}

export interface IProduct extends Document {
  _id: Types.ObjectId
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  discountPrice?: number
  discountPercent: number
  images: string[]
  category: Types.ObjectId
  subcategory?: string
  brand?: string
  stock: number
  sold: number
  sku: string
  tags: string[]
  variants: IVariant[]
  specifications: ISpecification[]
  ratingsAverage: number
  ratingsCount: number
  isFeatured: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IVariant {
  name: string
  options: string[]
}

export interface ISpecification {
  key: string
  value: string
}

export interface IOrder extends Document {
  _id: Types.ObjectId
  orderNumber: string
  user: Types.ObjectId
  items: IOrderItem[]
  shippingAddress: IAddress
  paymentMethod: 'cod' | 'card' | 'wallet'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  orderStatus: 'placed' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned'
  statusHistory: IStatusHistory[]
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  couponCode?: string
  trackingNumber?: string
  estimatedDelivery?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface IOrderItem {
  product: Types.ObjectId
  name: string
  image: string
  price: number
  quantity: number
  selectedVariants?: Record<string, string>
}

export interface IStatusHistory {
  status: string
  timestamp: Date
  note?: string
}

export interface IReview extends Document {
  _id: Types.ObjectId
  product: Types.ObjectId
  user: Types.ObjectId
  rating: number
  title?: string
  body?: string
  images: string[]
  isVerifiedPurchase: boolean
  helpfulCount: number
  createdAt: Date
}

export interface ICart extends Document {
  _id: Types.ObjectId
  user: Types.ObjectId
  items: ICartItem[]
  createdAt: Date
  updatedAt: Date
}

export interface ICartItem {
  product: Types.ObjectId
  name: string
  image: string
  price: number
  quantity: number
  selectedVariants?: Record<string, string>
}

export interface IWishlist extends Document {
  _id: Types.ObjectId
  user: Types.ObjectId
  products: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export interface INotification extends Document {
  _id: Types.ObjectId
  user: Types.ObjectId
  title: string
  body: string
  data?: Record<string, unknown>
  type: 'order' | 'promotion' | 'system'
  isRead: boolean
  createdAt: Date
}

export interface ICategory extends Document {
  _id: Types.ObjectId
  name: string
  slug: string
  description?: string
  image?: string
  icon?: string
  parent?: Types.ObjectId
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string
    role: 'customer' | 'admin'
  }
}

export interface PaginationQuery {
  page?: string
  limit?: string
  sort?: string
}

export interface ProductFilterQuery extends PaginationQuery {
  category?: string
  minPrice?: string
  maxPrice?: string
  rating?: string
  brand?: string
  inStock?: string
  q?: string
}
