import { Router } from 'express'
import * as productController from '../controllers/product.controller'
import { authenticate } from '../middleware/auth.middleware'
import { authorize } from '../middleware/role.middleware'
import { uploadMultiple } from '../middleware/upload.middleware'

const router = Router()

router.get('/', productController.getProducts)
router.get('/featured', productController.getFeaturedProducts)
router.get('/new-arrivals', productController.getNewArrivals)
router.get('/:id', productController.getProduct)
router.get('/:id/related', productController.getRelatedProducts)
router.post('/', authenticate, authorize('admin'), uploadMultiple, productController.createProduct)
router.put('/:id', authenticate, authorize('admin'), productController.updateProduct)
router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct)

export default router
