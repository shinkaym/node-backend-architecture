import express from 'express'
import { emailController } from '~/controllers/email.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const router = express.Router()

router.post('/newTemplate', asyncHandler(emailController.newTemplate))

export default router