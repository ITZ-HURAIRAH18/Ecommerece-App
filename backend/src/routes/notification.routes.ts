import { Router, Response } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import Notification from '../models/Notification'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/ApiResponse'
import { AuthenticatedRequest } from '../types'

const router = Router()

router.get('/', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id
  const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(50)
  res.json(new ApiResponse(200, 'Notifications fetched', notifications))
}))

router.put('/:id/read', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: userId },
    { isRead: true },
    { new: true }
  )
  res.json(new ApiResponse(200, 'Notification marked as read', notification))
}))

export default router
