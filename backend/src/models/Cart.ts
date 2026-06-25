import mongoose, { Model, Document } from 'mongoose'

export interface ICartDocument extends Document {
  user: mongoose.Types.ObjectId
  items: Array<{
    product: mongoose.Types.ObjectId
    name: string
    image: string
    price: number
    quantity: number
    selectedVariants?: Record<string, string>
  }>
  createdAt: Date
  updatedAt: Date
}

const cartItemSchema = new mongoose.Schema(
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

const cartSchema = new mongoose.Schema<ICartDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
)

const Cart: Model<ICartDocument> = mongoose.model<ICartDocument>('Cart', cartSchema)
export default Cart
