import mongoose, { Document, Model, CallbackError } from 'mongoose'
import bcrypt from 'bcryptjs'
import AddressSchema from './Address'

const PaymentMethodSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['card', 'wallet'], required: true },
    last4: { type: String, required: true },
    brand: { type: String, required: true },
    expiryMonth: { type: Number, required: true },
    expiryYear: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
)

export interface IUserDocument extends Document {
  name: string
  email: string
  phone?: string
  passwordHash: string
  avatar?: string
  role: 'customer' | 'admin'
  addresses: typeof AddressSchema[]
  savedPaymentMethods: typeof PaymentMethodSchema[]
  pushTokens: string[]
  refreshTokens: string[]
  isEmailVerified: boolean
  wishlist: mongoose.Types.ObjectId[]
  recentlyViewed: Array<{ productId: mongoose.Types.ObjectId; viewedAt: Date }>
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const recentlyViewedSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    viewedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    addresses: { type: [AddressSchema], default: [] },
    savedPaymentMethods: { type: [PaymentMethodSchema], default: [] },
    pushTokens: { type: [String], default: [] },
    refreshTokens: { type: [String], default: [] },
    isEmailVerified: { type: Boolean, default: false },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    recentlyViewed: { type: [recentlyViewedSchema], default: [] },
  },
  { timestamps: true }
)

userSchema.pre<IUserDocument>('save', async function (next: (err?: CallbackError) => void) {
  if (!this.isModified('passwordHash')) return next()
  try {
    const salt = await bcrypt.genSalt(12)
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
    next()
  } catch (err: any) {
    next(err)
  }
})

userSchema.methods.comparePassword = async function (this: IUserDocument, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

userSchema.methods.toJSON = function (this: IUserDocument) {
  const obj = this.toObject()
  delete obj.passwordHash
  delete obj.refreshTokens
  return obj
}

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema)
export default User
