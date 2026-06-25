import { Router } from 'express'
import * as reviewController from '../controllers/review.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/products/:id/reviews', reviewController.getReviews)
router.post('/products/:id/reviews', authenticate, reviewController.addReview)
router.put('/reviews/:id/helpful', reviewController.markHelpful)

export default router
