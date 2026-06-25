import mongoose, { Model, Document } from 'mongoose'

export interface IWishlistDocument extends Document {
  user: mongoose.Types.ObjectId
  products: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const wishlistSchema = new mongoose.Schema<IWishlistDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
)

const Wishlist: Model<IWishlistDocument> = mongoose.model<IWishlistDocument>('Wishlist', wishlistSchema)
export default Wishlist
