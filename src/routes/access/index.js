import express from 'express'
import { asyncHandler } from '~/auth/checkAuth'
import { accessController } from '~/controllers/access.controller'

const router = express.Router()

router.post('/shop/signup', asyncHandler(accessController.signUp))

export default router