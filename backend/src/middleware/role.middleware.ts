import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../types'
import { ApiError } from '../utils/ApiError'

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'Forbidden')
    }
    next()
  }
}
