import express from 'express'
import { cartController } from '~/controllers/cart.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const router = express.Router()

router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.delete))
router.post('/update', asyncHandler(cartController.update))
router.get('', asyncHandler(cartController.listToCart))

export default router