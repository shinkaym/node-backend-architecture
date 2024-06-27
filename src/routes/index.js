import express from 'express'
import accessRouter from './access'
import productRouter from './product'
import { apiKey, permission } from '~/auth/checkAuth'

const router = express.Router()

// check apiKey
router.use(apiKey)

// check permission
router.use(permission('0000'))

router.use('/v1/api/product', productRouter)
router.use('/v1/api', accessRouter)

export default router