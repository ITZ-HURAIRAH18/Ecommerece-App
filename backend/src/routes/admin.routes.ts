import { Router } from 'express'
import * as adminController from '../controllers/admin.controller'
import * as categoryController from '../controllers/category.controller'
import { authenticate } from '../middleware/auth.middleware'
import { authorize } from '../middleware/role.middleware'

const router = Router()

router.get('/dashboard', authenticate, authorize('admin'), adminController.getDashboard)
router.get('/orders', authenticate, authorize('admin'), adminController.getAllOrders)
router.put('/orders/:id/status', authenticate, authorize('admin'), adminController.updateOrderStatus)
router.get('/products', authenticate, authorize('admin'), adminController.getAllProducts)
router.post('/categories', authenticate, authorize('admin'), categoryController.createCategory)

export default router
