import { Router } from 'express'
import * as orderController from '../controllers/order.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/', authenticate, orderController.placeOrder)
router.get('/', authenticate, orderController.getOrders)
router.get('/:id', authenticate, orderController.getOrder)
router.put('/:id/cancel', authenticate, orderController.cancelOrder)

export default router
