import express from 'express'
import { authentication } from '~/auth/authUtils'
import { notificationController } from '~/controllers/notification.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const router = express.Router()

// authentication
router.use(authentication)

router.get('', asyncHandler(notificationController.listNotiByUser))

export default router