import mongoose, { Model, Document } from 'mongoose'

export interface IReviewDocument extends Document {
  product: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  rating: number
  title?: string
  body?: string
  images: string[]
  isVerifiedPurchase: boolean
  helpfulCount: number
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new mongoose.Schema<IReviewDocument>(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, maxlength: 200 },
    body: { type: String, maxlength: 2000 },
    images: { type: [String], default: [] },
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
)

reviewSchema.index({ product: 1, user: 1 }, { unique: true })

const Review: Model<IReviewDocument> = mongoose.model<IReviewDocument>('Review', reviewSchema)
export default Review
