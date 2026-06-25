import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export function generateAccessToken(userId: string, role: string): string {
  return jwt.sign({ _id: userId, role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as jwt.SignOptions)
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ _id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions)
}

export function verifyAccessToken(token: string): { _id: string; role: string } {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as { _id: string; role: string }
}

export function verifyRefreshToken(token: string): { _id: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { _id: string }
}
