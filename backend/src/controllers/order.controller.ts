import { Response } from 'express'
import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import { paginate } from '../utils/paginate'
import { AuthenticatedRequest } from '../types'
import Order from '../models/Order'
import Cart from '../models/Cart'
import Product from '../models/Product'

export const placeOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id
  const { shippingAddress, paymentMethod, notes } = req.body

  const cart = await Cart.findOne({ user: userId })
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Cart is empty')
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.product)
    if (!product || !product.isActive) {
      throw new ApiError(400, `Product ${item.name} is no longer available`)
    }
    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${item.name}`)
    }
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal >= 500 ? 0 : 49
  const discount = 0
  const total = subtotal + shippingFee - discount

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, sold: item.quantity },
    })
  }

  const order = await Order.create({
    user: userId,
    items: cart.items,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingFee,
    discount,
    total,
    notes,
    statusHistory: [{ status: 'placed', timestamp: new Date() }],
  })

  cart.items = []
  await cart.save()

  res.status(201).json(new ApiResponse(201, 'Order placed successfully', order))
})

export const getOrders = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id
  const { page = '1', limit = '10' } = req.query as { page?: string; limit?: string }

  const query = Order.find({ user: userId }).sort({ createdAt: -1 })
  const result = await paginate(query, parseInt(page), parseInt(limit))

  res.json(new ApiResponse(200, 'Orders fetched', result.data, result.pagination))
})

export const getOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(404, 'Order not found')
  }

  const order = await Order.findOne({ _id: req.params.id, user: userId })
    .populate('user', 'name email')
    .populate('items.product', 'name images price')
  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  res.json(new ApiResponse(200, 'Order fetched', order))
})

export const cancelOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(404, 'Order not found')
  }

  const order = await Order.findOne({ _id: req.params.id, user: userId })
  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  if (!['placed', 'confirmed'].includes(order.orderStatus)) {
    throw new ApiError(400, 'Order cannot be cancelled at this stage')
  }

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, sold: -item.quantity },
    })
  }

  order.orderStatus = 'cancelled'
  order.statusHistory.push({ status: 'cancelled', timestamp: new Date(), note: 'Cancelled by user' })
  await order.save()

  res.json(new ApiResponse(200, 'Order cancelled', order))
})
