import express from 'express'
import { authentication } from '~/auth/authUtils'
import { productController } from '~/controllers/product.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const router = express.Router()

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProducts))
router.get('/:id', asyncHandler(productController.findProduct))
router.get('', asyncHandler(productController.findAllProducts))

// authentication
router.use(authentication)

router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))

export default router