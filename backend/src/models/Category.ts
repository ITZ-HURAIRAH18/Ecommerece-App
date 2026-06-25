import mongoose, { Model, Document, CallbackError } from 'mongoose'

export interface ICategoryDocument extends Document {
  name: string
  slug: string
  description?: string
  image?: string
  icon?: string
  parent?: mongoose.Types.ObjectId
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new mongoose.Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String },
    image: { type: String },
    icon: { type: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

categorySchema.pre<ICategoryDocument>('save', function (next: (err?: CallbackError) => void) {
  if (this.isModified('name') && (!this.slug || this.isModified('name'))) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  next()
})

const Category: Model<ICategoryDocument> = mongoose.model<ICategoryDocument>('Category', categorySchema)
export default Category
