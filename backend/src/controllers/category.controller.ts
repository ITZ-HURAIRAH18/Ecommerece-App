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

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, description, image, icon, parent, order, isActive } = req.body

  const category = await Category.findById(id)
  if (!category) throw new ApiError(404, 'Category not found')

  if (name) category.name = name
  if (description !== undefined) category.description = description
  if (image !== undefined) category.image = image
  if (icon !== undefined) category.icon = icon
  if (parent !== undefined) category.parent = parent || null
  if (order !== undefined) category.order = order
  if (isActive !== undefined) category.isActive = isActive
  await category.save()

  res.json(new ApiResponse(200, 'Category updated', category))
})

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id)
  if (!category) throw new ApiError(404, 'Category not found')

  res.json(new ApiResponse(200, 'Category deleted'))
})
