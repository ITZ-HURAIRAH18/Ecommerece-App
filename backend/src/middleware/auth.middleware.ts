import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { AuthenticatedRequest } from '../types'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'

export const authenticate = asyncHandler(
  async (req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Unauthorized')
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { _id: string; role: 'customer' | 'admin' }
      req.user = { _id: decoded._id, role: decoded.role }
      next()
    } catch {
      throw new ApiError(401, 'Unauthorized')
    }
  }
)
