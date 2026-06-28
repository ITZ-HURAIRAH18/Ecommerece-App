import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import categoryRoutes from './routes/category.routes'
import cartRoutes from './routes/cart.routes'
import orderRoutes from './routes/order.routes'
import reviewRoutes from './routes/review.routes'
import wishlistRoutes from './routes/wishlist.routes'
import searchRoutes from './routes/search.routes'
import notificationRoutes from './routes/notification.routes'
import adminRoutes from './routes/admin.routes'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running' })
})
app.use('/api/health', (req, res) => {
    console.log("Server is Running");
    res.send("Server is Running");
});
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/admin', adminRoutes)

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.use(errorHandler)

export default app
