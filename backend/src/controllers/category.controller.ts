import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import Category from '../models/Category'

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Category.find({ isActive: true })
    .sort({ order: 1, name: 1 })

  res.json(new ApiResponse(200, 'Categories fetched', categories))
})

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, image, icon, parent, order } = req.body

  const existing = await Category.findOne({ name })
  if (existing) {
    throw new ApiError(409, 'Category already exists')
  }

  const category = await Category.create({
    name,
    description,
    image,
    icon,
    parent,
    order,
  })

  res.status(201).json(new ApiResponse(201, 'Category created', category))
})
