import mongoose, { Model, Document, CallbackError } from 'mongoose'

export interface IProductDocument extends Document {
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  discountPrice?: number
  discountPercent: number
  images: string[]
  category: mongoose.Types.ObjectId
  subcategory?: string
  brand?: string
  stock: number
  sold: number
  sku: string
  tags: string[]
  variants: Array<{ name: string; options: string[] }>
  specifications: Array<{ key: string; value: string }>
  ratingsAverage: number
  ratingsCount: number
  isFeatured: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const variantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    options: { type: [String], required: true },
  },
  { _id: false }
)

const specificationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
)

const productSchema = new mongoose.Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    images: { type: [String], default: [] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: String },
    brand: { type: String },
    stock: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0, min: 0 },
    sku: { type: String, unique: true, required: true },
    tags: { type: [String], default: [] },
    variants: { type: [variantSchema], default: [] },
    specifications: { type: [specificationSchema], default: [] },
    ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

productSchema.virtual('discountPercent').get(function (this: IProductDocument) {
  if (this.discountPrice && this.price > 0) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100)
  }
  return 0
})

productSchema.set('toJSON', { virtuals: true })
productSchema.set('toObject', { virtuals: true })

productSchema.pre<IProductDocument>('save', function (next: (err?: CallbackError) => void) {
  if (this.isModified('name') && (!this.slug || this.isModified('name'))) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  next()
})

productSchema.index({ name: 'text', description: 'text' })

const Product: Model<IProductDocument> = mongoose.model<IProductDocument>('Product', productSchema)
export default Product
