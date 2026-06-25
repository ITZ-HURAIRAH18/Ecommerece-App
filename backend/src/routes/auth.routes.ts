import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'
import { authLimiter } from '../middleware/rateLimiter'

const router = Router()

router.post('/register', authController.register)
router.post('/verify-email', authController.verifyEmail)
router.post('/login', authLimiter, authController.login)
router.post('/refresh', authController.refreshToken)
router.post('/logout', authenticate, authController.logout)
router.post('/forgot-password', authLimiter, authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

export default router
