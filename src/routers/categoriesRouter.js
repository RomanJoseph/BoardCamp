import express from 'express'
import { getCategories, postCategory } from '../controllers/categoriesController.js'
import { validateCategoriesInput } from '../middlewares/categoriesMiddleware.js'

const router = express.Router()

router.get('/categories', getCategories)
router.post('/categories', validateCategoriesInput, postCategory)

export default router