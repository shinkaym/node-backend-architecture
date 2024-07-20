import express from 'express'
import { authentication } from '~/auth/authUtils'
import { uploadDisk, uploadMemory } from '~/configs/multer.config'
import { uploadController } from '~/controllers/upload.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const router = express.Router()

// authentication
// router.use(authentication)

router.post('/product', asyncHandler(uploadController.uploadFile))
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb))

router.post('/product/bucket', uploadMemory.single('file'), asyncHandler(uploadController.uploadFileFromLocalS3))
export default router