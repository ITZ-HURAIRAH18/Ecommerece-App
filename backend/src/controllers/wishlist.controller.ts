import { Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import { AuthenticatedRequest } from '../types'
import Wishlist from '../models/Wishlist'
import Product from '../models/Product'

export const getWishlist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id

  let wishlist = await Wishlist.findOne({ user: userId }).populate('products')
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] })
  }

  res.json(new ApiResponse(200, 'Wishlist fetched', wishlist))
})

export const toggleWishlist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id
  const { productId } = req.params

  const product = await Product.findById(productId)
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found')
  }

  let wishlist = await Wishlist.findOne({ user: userId })
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] })
  }

  const productIndex = wishlist.products.findIndex(
    (p) => p.toString() === productId
  )

  let added = false
  if (productIndex > -1) {
    wishlist.products.splice(productIndex, 1)
  } else {
    wishlist.products.push(product._id)
    added = true
  }

  await wishlist.save()

  res.json(new ApiResponse(200, added ? 'Added to wishlist' : 'Removed from wishlist', {
    wishlisted: added,
    wishlist,
  }))
})
