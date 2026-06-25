import { Router } from 'express'
import * as adminController from '../controllers/admin.controller'
import * as productController from '../controllers/product.controller'
import * as categoryController from '../controllers/category.controller'
import { authenticate } from '../middleware/auth.middleware'
import { authorize } from '../middleware/role.middleware'
import { upload, uploadMultiple } from '../middleware/upload.middleware'

const router = Router()

router.get('/dashboard', authenticate, authorize('admin'), adminController.getDashboard)
router.get('/orders', authenticate, authorize('admin'), adminController.getAllOrders)
router.put('/orders/:id/status', authenticate, authorize('admin'), adminController.updateOrderStatus)
router.get('/products', authenticate, authorize('admin'), adminController.getAllProducts)
router.post('/products', authenticate, authorize('admin'), uploadMultiple, productController.createProduct)
router.put('/products/:id', authenticate, authorize('admin'), uploadMultiple, productController.updateProduct)
router.delete('/products/:id', authenticate, authorize('admin'), productController.deleteProduct)
router.get('/categories', authenticate, authorize('admin'), categoryController.getCategories)
router.post('/categories', authenticate, authorize('admin'), upload, categoryController.createCategory)
router.get('/banners', authenticate, authorize('admin'), adminController.getBanners)
router.post('/banners', authenticate, authorize('admin'), upload, adminController.createBanner)
router.delete('/banners/:id', authenticate, authorize('admin'), adminController.deleteBanner)
router.get('/users', authenticate, authorize('admin'), adminController.getUsers)

export default router
