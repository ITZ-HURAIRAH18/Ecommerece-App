import mongoose, { Model, Document } from 'mongoose'

export interface INotificationDocument extends Document {
  user: mongoose.Types.ObjectId
  title: string
  body: string
  data?: Record<string, unknown>
  type: 'order' | 'promotion' | 'system'
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

const notificationSchema = new mongoose.Schema<INotificationDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed },
    type: { type: String, enum: ['order', 'promotion', 'system'], required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Notification: Model<INotificationDocument> = mongoose.model<INotificationDocument>('Notification', notificationSchema)
export default Notification
