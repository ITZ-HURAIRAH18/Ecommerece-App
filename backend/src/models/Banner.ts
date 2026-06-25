import mongoose, { Model, Document } from 'mongoose'

export interface IBannerDocument extends Document {
  image: string
  title?: string
  link?: string
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const bannerSchema = new mongoose.Schema<IBannerDocument>(
  {
    image: { type: String, required: true },
    title: { type: String },
    link: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Banner: Model<IBannerDocument> = mongoose.model<IBannerDocument>('Banner', bannerSchema)
export default Banner
