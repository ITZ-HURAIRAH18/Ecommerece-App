import { Router } from 'express'
import * as cartController from '../controllers/cart.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/', authenticate, cartController.getCart)
router.post('/items', authenticate, cartController.addItem)
router.put('/items/:productId', authenticate, cartController.updateItem)
router.delete('/items/:productId', authenticate, cartController.removeItem)
router.delete('/', authenticate, cartController.clearCart)

export default router
