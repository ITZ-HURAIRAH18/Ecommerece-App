import { Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import { AuthenticatedRequest } from '../types'
import Cart from '../models/Cart'
import Product from '../models/Product'

export const getCart = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id

  let cart = await Cart.findOne({ user: userId }).populate('items.product')
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] })
  }

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  res.json(new ApiResponse(200, 'Cart fetched', { ...cart.toJSON(), total, itemCount }))
})

export const addItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id
  const { productId, quantity = 1, selectedVariants } = req.body

  const product = await Product.findById(productId)
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found')
  }

  if (product.stock < quantity) {
    throw new ApiError(400, 'Insufficient stock')
  }

  let cart = await Cart.findOne({ user: userId })
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] })
  }

  const existingIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  )

  if (existingIndex > -1) {
    cart.items[existingIndex].quantity += quantity
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      price: product.discountPrice || product.price,
      quantity,
      selectedVariants,
    })
  }

  await cart.save()

  res.status(200).json(new ApiResponse(200, 'Item added to cart', cart))
})

export const updateItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id
  const { productId } = req.params
  const { quantity } = req.body

  const cart = await Cart.findOne({ user: userId })
  if (!cart) {
    throw new ApiError(404, 'Cart not found')
  }

  const item = cart.items.find((item) => item.product.toString() === productId)
  if (!item) {
    throw new ApiError(404, 'Item not found in cart')
  }

  if (quantity < 1) {
    throw new ApiError(400, 'Quantity must be at least 1')
  }

  const product = await Product.findById(productId)
  if (product && product.stock < quantity) {
    throw new ApiError(400, 'Insufficient stock')
  }

  item.quantity = quantity
  await cart.save()

  res.json(new ApiResponse(200, 'Cart updated', cart))
})

export const removeItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id
  const { productId } = req.params

  const cart = await Cart.findOne({ user: userId })
  if (!cart) {
    throw new ApiError(404, 'Cart not found')
  }

  cart.items = cart.items.filter((item) => item.product.toString() !== productId)
  await cart.save()

  res.json(new ApiResponse(200, 'Item removed from cart', cart))
})

export const clearCart = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id

  const cart = await Cart.findOne({ user: userId })
  if (cart) {
    cart.items = []
    await cart.save()
  }

  res.json(new ApiResponse(200, 'Cart cleared'))
})
