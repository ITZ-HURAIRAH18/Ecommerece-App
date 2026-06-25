import app from './app'
import { connectDB } from './config/db'
import { env } from './config/env'

const start = async () => {
  await connectDB()

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
