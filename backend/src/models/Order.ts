import mongoose, { Model, Document, CallbackError } from 'mongoose'
import AddressSchema from './Address'

export interface IOrderDocument extends Document {
  orderNumber: string
  user: mongoose.Types.ObjectId
  items: Array<{
    product: mongoose.Types.ObjectId
    name: string
    image: string
    price: number
    quantity: number
    selectedVariants?: Record<string, string>
  }>
  shippingAddress: typeof AddressSchema
  paymentMethod: 'cod' | 'card' | 'wallet'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  orderStatus: 'placed' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned'
  statusHistory: Array<{ status: string; timestamp: Date; note?: string }>
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

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    selectedVariants: { type: Map, of: String },
  },
  { _id: false }
)

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema<IOrderDocument>(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    shippingAddress: { type: AddressSchema, required: true },
    paymentMethod: { type: String, enum: ['cod', 'card', 'wallet'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
      default: 'placed',
    },
    statusHistory: { type: [statusHistorySchema], default: [] },
    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    couponCode: { type: String },
    trackingNumber: { type: String },
    estimatedDelivery: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
)

orderSchema.pre<IOrderDocument>('save', function (next: (err?: CallbackError) => void) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}`
  }
  next()
})

const Order: Model<IOrderDocument> = mongoose.model<IOrderDocument>('Order', orderSchema)
export default Order
