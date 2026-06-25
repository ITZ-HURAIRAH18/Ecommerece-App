import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/ApiResponse'
import { paginate } from '../utils/paginate'
import { PaginationQuery } from '../types'
import Product from '../models/Product'

interface SearchQuery extends PaginationQuery {
  q?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  rating?: string
  brand?: string
  inStock?: string
  sort?: string
}

export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    q = '',
    page = '1',
    limit = '20',
    category,
    minPrice,
    maxPrice,
    rating,
    brand,
    inStock,
    sort = 'relevance',
  } = req.query as unknown as SearchQuery

  const filter: Record<string, unknown> = { isActive: true }

  if (q.trim()) {
    filter.$text = { $search: q }
  }

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

  let sortOption: Record<string, 1 | -1 | { $meta: 'textScore' }> = { createdAt: -1 }
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
      sortOption = { createdAt: -1 }
      break
    case 'relevance':
    default:
      sortOption = q.trim() ? { score: { $meta: 'textScore' } } : { createdAt: -1 }
      break
  }

  let query = Product.find(filter)
  if (q.trim() && sort === 'relevance') {
    query = Product.find(filter, { score: { $meta: 'textScore' } })
  }
  query = query.sort(sortOption)

  const result = await paginate(query, parseInt(page), parseInt(limit))

  res.json(new ApiResponse(200, 'Search results', result.data, result.pagination))
})

export const getSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const { q = '' } = req.query as { q?: string }

  if (!q.trim()) {
    res.json(new ApiResponse(200, 'Suggestions', []))
    return
  }

  const suggestions = await Product.find(
    { name: { $regex: q, $options: 'i' }, isActive: true },
    { name: 1, _id: 0 }
  )
    .limit(8)
    .then((products) => products.map((p) => p.name))

  res.json(new ApiResponse(200, 'Suggestions', suggestions))
})
