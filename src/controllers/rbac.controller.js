import { SuccessResponse } from '~/core/success.response'
import RbacService from '~/services/rbac.service'

class RbacController {
  newRole = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'created role',
      metadata: await RbacService.createRole(req.body)
    })
  }
  newResource = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'created resource',
      metadata: await RbacService.createResource(req.body)
    })
  }
  listRoles = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'get list roles',
      metadata: await RbacService.roleList(req.body)
    })
  }
  listResources = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'get list resources',
      metadata: await RbacService.resourceList(req.body)
    })
  }
}

export const rbacController = new RbacController
