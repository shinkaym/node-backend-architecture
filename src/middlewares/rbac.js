import { AuthFailureError } from '~/core/error.response'
import rbac from './role.middleware'
import RbacService from '~/services/rbac.service'

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      // role list should be stored in cache
      rbac.setGrants(await RbacService.roleList({
        userId: 9999
      }))
      const rol_name = req.query.role
      const permission = rbac.can(rol_name)[action](resource)
      if (!permission.granted) {
        throw new AuthFailureError('you dont have enough permissions')
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

export {
  grantAccess
}