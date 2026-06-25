import mongoose from 'mongoose'
import { PaginationMeta } from './ApiResponse'

interface PaginatedResult<T> {
  data: T[]
  pagination: PaginationMeta
}

export async function paginate<T>(
  query: mongoose.Query<T[], T>,
  page: number,
  limit: number
): Promise<PaginatedResult<T>> {
  const pageNum = Math.max(1, page)
  const limitNum = Math.max(1, Math.min(100, limit))
  const skip = (pageNum - 1) * limitNum

  const total = await query.model.countDocuments(query.getFilter())
  const data = await query.clone().skip(skip).limit(limitNum).exec()

  return {
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  }
}
