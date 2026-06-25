import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import { paginate } from '../utils/paginate'
import { AuthenticatedRequest, ProductFilterQuery } from '../types'
import Product from '../models/Product'

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = '1',
    limit = '12',
    sort = 'newest',
    category,
    minPrice,
    maxPrice,
    rating,
    brand,
    inStock,
    q,
  } = req.query as unknown as ProductFilterQuery

  const filter: Record<string, unknown> = { isActive: true }

  if (category) {
    filter.category = category
  }

  if (minPrice || maxPrice) {
    const priceFilter: Record<string, unknown> = {}
    if (minPrice) priceFilter.$gte = parseFloat(minPrice)
    if (maxPrice) priceFilter.$lte = parseFloat(maxPrice)
    filter.price = priceFilter
  }

  if (rating) {
    filter.ratingsAverage = { $gte: parseFloat(rating) }
  }

  if (brand) {
    filter.brand = brand
  }

  if (inStock === 'true') {
    filter.stock = { $gt: 0 }
  }

  if (q) {
    filter.$text = { $search: q }
  }

  let sortOption: Record<string, 1 | -1> = { createdAt: -1 }
  switch (sort) {
    case 'price_asc':
      sortOption = { price: 1 }
      break
    case 'price_desc':
      sortOption = { price: -1 }
      break
    case 'popular':
      sortOption = { sold: -1, ratingsAverage: -1 }
      break
    case 'newest':
    default:
      sortOption = { createdAt: -1 }
      break
  }

  let query = Product.find(filter).sort(sortOption)
  if (q) {
    query = Product.find(filter, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } })
  }

  const result = await paginate(query, parseInt(page), parseInt(limit))

  res.json(new ApiResponse(200, 'Products fetched', result.data, result.pagination))
})

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate('category')

  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found')
  }

  res.json(new ApiResponse(200, 'Product fetched', product))
})

export const getFeaturedProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(10)

  res.json(new ApiResponse(200, 'Featured products fetched', products))
})

export const getNewArrivals = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Product.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(20)

  res.json(new ApiResponse(200, 'New arrivals fetched', products))
})

export const getRelatedProducts = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .sort({ ratingsAverage: -1, sold: -1 })
    .limit(8)

  res.json(new ApiResponse(200, 'Related products fetched', related))
})

export const createProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const product = await Product.create(req.body)

  res.status(201).json(new ApiResponse(201, 'Product created', product))
})

export const updateProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  Object.assign(product, req.body)
  await product.save()

  res.json(new ApiResponse(200, 'Product updated', product))
})

export const deleteProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  product.isActive = false
  await product.save()

  res.json(new ApiResponse(200, 'Product deleted'))
})
