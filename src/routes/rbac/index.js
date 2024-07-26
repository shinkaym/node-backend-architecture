import express from 'express'
import { rbacController } from '~/controllers/rbac.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const router = express.Router()

router.post('/role', asyncHandler(rbacController.newRole))
router.get('/roles', asyncHandler(rbacController.listRoles))

router.post('/resource', asyncHandler(rbacController.newResource))
router.get('/resources', asyncHandler(rbacController.listResources))

export default router