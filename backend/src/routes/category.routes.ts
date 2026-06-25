import { Router } from 'express'
import * as categoryController from '../controllers/category.controller'
import { authenticate } from '../middleware/auth.middleware'
import { authorize } from '../middleware/role.middleware'

const router = Router()

router.get('/', categoryController.getCategories)
router.post('/', authenticate, authorize('admin'), categoryController.createCategory)

export default router
