import { Router } from 'express'
import * as searchController from '../controllers/search.controller'

const router = Router()

router.get('/', searchController.searchProducts)
router.get('/suggestions', searchController.getSuggestions)

export default router
