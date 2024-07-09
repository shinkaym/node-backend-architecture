import express from 'express'
import { authentication } from '~/auth/authUtils'
import { discountController } from '~/controllers/discount.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const router = express.Router()

router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProducts))

router.use(authentication)

router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodes))


export default router