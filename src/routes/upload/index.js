import express from 'express'
import { authentication } from '~/auth/authUtils'
import { uploadDisk } from '~/configs/multer.config'
import { uploadController } from '~/controllers/upload.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const router = express.Router()

// authentication
// router.use(authentication)

router.post('/product', asyncHandler(uploadController.uploadFile))
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb))

export default router