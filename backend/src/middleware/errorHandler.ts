import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { ApiError } from '../utils/ApiError'
import { env } from '../config/env'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500
  let message = 'Internal server error'
  let errors: unknown[] | undefined

  if (err instanceof ApiError) {
    statusCode = err.statusCode
    message = err.message
    errors = err.errors
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    message = 'Validation failed'
    errors = Object.values(err.errors).map((e) => e.message)
  } else if ((err as any).code === 11000) {
    statusCode = 409
    message = 'Duplicate field value'
    const keyValue = (err as any).keyValue
    errors = keyValue ? Object.keys(keyValue).map((key) => `${key}: ${keyValue[key]} already exists`) : undefined
  } else if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid ${(err as any).path}: ${(err as any).value}`
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
