import { Response } from 'express'
import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import { AuthenticatedRequest } from '../types'
import Order from '../models/Order'
import User from '../models/User'
import Product from '../models/Product'
import Category from '../models/Category'
import Banner from '../models/Banner'
import Notification from '../models/Notification'
import { sendPushNotification } from '../services/push.service'

export const getDashboard = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const [
    totalOrders,
    totalRevenueResult,
    totalUsers,
    totalProducts,
    recentOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    User.countDocuments(),
    Product.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
  ])

  const totalRevenue = totalRevenueResult[0]?.total || 0

  res.status(200).json(
    new ApiResponse(200, 'Dashboard data fetched', {
      stats: { totalOrders, totalRevenue, totalUsers, totalProducts },
      recentOrders,
    })
  )
})

export const getAllOrders = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 20
  const status = req.query.status as string

  const filter: Record<string, unknown> = {}
  if (status) filter.orderStatus = status

  const skip = (page - 1) * limit

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email phone'),
    Order.countDocuments(filter),
  ])

  res.status(200).json(
    new ApiResponse(200, 'Orders fetched', orders, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    })
  )
})

export const updateOrderStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params
  const { orderStatus, note } = req.body

  const order = await Order.findById(id).populate('user', 'pushTokens')
  if (!order) {
    res.status(404).json(new ApiResponse(404, 'Order not found'))
    return
  }

  order.orderStatus = orderStatus
  order.statusHistory.push({ status: orderStatus, timestamp: new Date(), note })
  await order.save()

  const pushTokens = (order.user as any)?.pushTokens || []
  if (pushTokens.length > 0) {
    await sendPushNotification(
      pushTokens,
      'Order Update',
      `Your order #${order.orderNumber} is now ${orderStatus.replace(/_/g, ' ')}`,
      { type: 'order', orderId: order._id.toString() }
    )
  }

  await Notification.create({
    user: order.user._id || order.user,
    title: 'Order Update',
    body: `Your order #${order.orderNumber} is now ${orderStatus.replace(/_/g, ' ')}`,
    type: 'order',
    data: { orderId: order._id.toString() },
  })

  res.status(200).json(new ApiResponse(200, 'Order status updated', order))
})

export const getAllProducts = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 20
  const skip = (page - 1) * limit

  const [products, total] = await Promise.all([
    Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category', 'name slug'),
    Product.countDocuments(),
  ])

  res.status(200).json(
    new ApiResponse(200, 'Products fetched', products, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    })
  )
})

export const getUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 20
  const skip = (page - 1) * limit

  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select('-passwordHash -refreshTokens'),
    User.countDocuments(),
  ])

  res.status(200).json(
    new ApiResponse(200, 'Users fetched', users, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    })
  )
})

export const createUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password, role } = req.body
  const existing = await User.findOne({ email })
  if (existing) throw new ApiError(409, 'Email already registered')

  const user = await User.create({ name, email, passwordHash: password, role: role || 'customer' })
  res.status(201).json(new ApiResponse(201, 'User created', user))
})

export const updateUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params
  const { name, email, role, phone } = req.body

  const user = await User.findById(id)
  if (!user) throw new ApiError(404, 'User not found')

  if (email && email !== user.email) {
    const existing = await User.findOne({ email })
    if (existing) throw new ApiError(409, 'Email already in use')
  }

  if (name) user.name = name
  if (email) user.email = email
  if (role) user.role = role
  if (phone !== undefined) user.phone = phone
  await user.save()

  res.json(new ApiResponse(200, 'User updated', user))
})

export const deleteUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(400, 'Invalid user ID')
  }
  if (req.user!._id === req.params.id) {
    throw new ApiError(400, 'Cannot delete your own account')
  }
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) throw new ApiError(404, 'User not found')
  res.json(new ApiResponse(200, 'User deleted'))
})

export const getBanners = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
  res.status(200).json(new ApiResponse(200, 'Banners fetched', banners))
})

export const createBanner = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { title, link, order } = req.body
  const image = req.file ? (req.file as any).path : req.body.image
  if (!image) throw new ApiError(400, 'Banner image is required')

  const banner = await Banner.create({ image, title, link, order: order || 0 })
  res.status(201).json(new ApiResponse(201, 'Banner created', banner))
})

export const updateBanner = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params
  const { title, link, order, isActive } = req.body
  const image = req.file ? (req.file as any).path : undefined

  const banner = await Banner.findById(id)
  if (!banner) throw new ApiError(404, 'Banner not found')

  if (image) banner.image = image
  if (title !== undefined) banner.title = title
  if (link !== undefined) banner.link = link
  if (order !== undefined) banner.order = order
  if (isActive !== undefined) banner.isActive = isActive
  await banner.save()

  res.json(new ApiResponse(200, 'Banner updated', banner))
})

export const deleteBanner = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const banner = await Banner.findByIdAndDelete(req.params.id)
  if (!banner) throw new ApiError(404, 'Banner not found')
  res.status(200).json(new ApiResponse(200, 'Banner deleted'))
})
