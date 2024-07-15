import express from 'express'
import { authentication } from '~/auth/authUtils'
import { commentController } from '~/controllers/comment.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const router = express.Router()

router.use(authentication)

router.get('', asyncHandler(commentController.getCommentsByParentId))
router.delete('', asyncHandler(commentController.deleteComment))
router.post('', asyncHandler(commentController.createComment))

export default router