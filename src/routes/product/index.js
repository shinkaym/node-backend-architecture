import express from 'express'
import { authentication } from '~/auth/authUtils'
import { productController } from '~/controllers/product.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const router = express.Router()

// authentication
router.use(authentication)

router.post('', asyncHandler(productController.createProduct))

export default router