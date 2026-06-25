import { Request, Response } from 'express'
import crypto from 'crypto'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import { AuthenticatedRequest } from '../types'
import User from '../models/User'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../services/token.service'
import { sendOTP, sendPasswordReset } from '../services/email.service'

const otpStore = new Map<string, { otp: string; expiresAt: Date }>()

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new ApiError(409, 'Email already registered')
  }

  const user = await User.create({ name, email, passwordHash: password })

  const otp = generateOtp()
  otpStore.set(email, { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) })

  try {
    await sendOTP(email, otp)
  } catch (err) {
    console.warn('Failed to send OTP email:', err)
  }

  res.status(201).json(new ApiResponse(201, 'Account created. Please verify your email.'))
})

export const verifyEmail = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id
  const { otp } = req.body

  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, 'Email already verified')
  }

  const stored = otpStore.get(user.email)
  if (!stored || stored.otp !== otp || stored.expiresAt < new Date()) {
    throw new ApiError(400, 'Invalid or expired OTP')
  }

  otpStore.delete(user.email)
  user.isEmailVerified = true
  await user.save()

  res.json(new ApiResponse(200, 'Email verified successfully'))
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(401, 'Invalid email or password')
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password')
  }

  const accessToken = generateAccessToken(user._id.toString(), user.role)
  const refreshToken = generateRefreshToken(user._id.toString())

  user.refreshTokens.push(refreshToken)
  await user.save()

  res.json(new ApiResponse(200, 'Login successful', { accessToken, refreshToken, user }))
})

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body

  if (!token) {
    throw new ApiError(400, 'Refresh token required')
  }

  let decoded: { _id: string }
  try {
    decoded = verifyRefreshToken(token)
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token')
  }

  const user = await User.findById(decoded._id)
  if (!user) {
    throw new ApiError(401, 'User not found')
  }

  const tokenIndex = user.refreshTokens.indexOf(token)
  if (tokenIndex === -1) {
    throw new ApiError(401, 'Refresh token not recognized')
  }

  const newAccessToken = generateAccessToken(user._id.toString(), user.role)

  res.json(new ApiResponse(200, 'Token refreshed', { accessToken: newAccessToken }))
})

export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!._id
  const { refreshToken: token } = req.body

  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  if (token) {
    user.refreshTokens = user.refreshTokens.filter((rt) => rt !== token)
    await user.save()
  }

  res.json(new ApiResponse(200, 'Logged out successfully'))
})

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(404, 'User with that email not found')
  }

  const otp = generateOtp()
  otpStore.set(email, { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) })

  try {
    await sendPasswordReset(email, otp)
  } catch (err) {
    console.warn('Failed to send password reset email:', err)
  }

  res.json(new ApiResponse(200, 'Password reset OTP sent to email'))
})

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body

  const stored = otpStore.get(email)
  if (!stored || stored.otp !== otp || stored.expiresAt < new Date()) {
    throw new ApiError(400, 'Invalid or expired OTP')
  }

  otpStore.delete(email)

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  user.passwordHash = newPassword
  user.refreshTokens = []
  await user.save()

  res.json(new ApiResponse(200, 'Password reset successfully'))
})
