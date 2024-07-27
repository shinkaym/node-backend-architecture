import express from 'express'
import { userController } from '~/controllers/user.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const router = express.Router()

router.post('/newUser', asyncHandler(userController.newUser))
router.get('/welcome-back', asyncHandler(userController.checkLoginEmailToken))

export default router