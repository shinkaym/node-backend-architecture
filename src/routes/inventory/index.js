import express from 'express'
import { authentication } from '~/auth/authUtils'
import { inventoryController } from '~/controllers/inventory.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const router = express.Router()

router.use(authentication)

router.post('', asyncHandler(inventoryController.addStockToInventory))


export default router