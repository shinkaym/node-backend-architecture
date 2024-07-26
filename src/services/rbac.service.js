import ResourceModel from '~/models/resource.model'
import RoleModel from '~/models/role.model'

class RbacService {
  static async createResource({
    name = 'profile',
    slug = 'p00001',
    description = ''
  }) {
    try {
      // 1. Check name or slug exist

      // 2. new resource
      return await ResourceModel.create({
        src_name: name,
        src_slug: slug,
        src_description: description
      })
    } catch (error) {
      return error
    }
  }
  static async resourceList({
    userId = 0,
    limit = 30,
    offset = 0,
    search = ''
  }) {
    try {
      // 1. check admin ? middleware function

      // 2. get list of resources
      return await ResourceModel.aggregate([
        {
          $project: {
            _id: 0,
            name: '$src_name',
            slug: '$src_slug',
            description: '$src_description',
            resourceId: '$_id',
            createdAt: 1
          }
        }
      ])
    } catch (error) {
      return []
    }
  }
  static async createRole({
    name = 'shop',
    slug = 's00001',
    description = 'extend from shop or user',
    grants = []
  }) {
    try {
      // 1. check role exists

      // 2. new role
      return await RoleModel.create({
        rol_name: name,
        rol_slug: slug,
        rol_description: description,
        rol_grants: grants
      })
    } catch (error) {
      return error
    }
  }
  static async roleList({
    userId = 0,
    limit = 30,
    offset = 0,
    search = ''
  }) {
    try {
      // 1. userId

      // 2. List roles
      return await RoleModel.aggregate([
        {
          $unwind: '$rol_grants'
        },
        {
          $lookup: {
            from: 'Resources',
            localField: 'rol_grants.resource',
            foreignField: '_id',
            as:'resource'
          }
        },
        {
          $unwind: '$resource'
        },
        {
          $project: {
            role: '$rol_name',
            resource: '$resource.src_name',
            action: '$rol_grants.actions',
            attributes: '$rol_grants.attributes'
          }
        },
        {
          $unwind: '$action'
        },
        {
          $project: {
            _id: 0,
            role: 1,
            resource: 1,
            action: '$action',
            attributes: 1
          }
        }
      ])
    } catch (error) {
      return error
    }
  }
}

export default RbacService