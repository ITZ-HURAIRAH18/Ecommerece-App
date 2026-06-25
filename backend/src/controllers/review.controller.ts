import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import { paginate } from '../utils/paginate'
import { AuthenticatedRequest } from '../types'
import Review from '../models/Review'
import Product from '../models/Product'
import Order from '../models/Order'

export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const { page = '1', limit = '10' } = req.query as { page?: string; limit?: string }

  const query = Review.find({ product: id })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })

  const result = await paginate(query, parseInt(page), parseInt(limit))

  const product = await Product.findById(id).select('ratingsAverage ratingsCount')

  res.json(new ApiResponse(200, 'Reviews fetched', {
    reviews: result.data,
    productRating: product,
  }, result.pagination))
})

export const addReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id
  const { id } = req.params
  const { rating, title, body, images } = req.body

  const product = await Product.findById(id)
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found')
  }

  const existing = await Review.findOne({ product: id, user: userId })
  if (existing) {
    throw new ApiError(400, 'You have already reviewed this product')
  }

  const hasPurchased = await Order.findOne({
    user: userId,
    'items.product': id,
    orderStatus: 'delivered',
  })

  const review = await Review.create({
    product: id,
    user: userId,
    rating,
    title,
    body,
    images: images || [],
    isVerifiedPurchase: !!hasPurchased,
  })

  const stats = await Review.aggregate([
    { $match: { product: product._id } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])

  if (stats.length > 0) {
    product.ratingsAverage = Math.round(stats[0].avg * 10) / 10
    product.ratingsCount = stats[0].count
    await product.save()
  }

  res.status(201).json(new ApiResponse(201, 'Review added', review))
})

export const markHelpful = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { $inc: { helpfulCount: 1 } },
    { new: true }
  )

  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  res.json(new ApiResponse(200, 'Marked as helpful', review))
})
