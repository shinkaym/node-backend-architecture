import express from 'express'
import { authentication } from '~/auth/authUtils'
import { productController } from '~/controllers/product.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const router = express.Router()

router.post('/search/:keySearch', asyncHandler(productController.getListSearchProducts))

// authentication
router.use(authentication)

router.post('', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

router.post('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.post('/published/all', asyncHandler(productController.getAllPublishForShop))

export default router