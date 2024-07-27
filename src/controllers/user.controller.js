import { SuccessResponse } from '~/core/success.response'
import UserService from '~/services/user.service'

class UserController {
  newUser = async (req, res) => {
    const respond = await UserService.newUser({
      email: req.body.email
    })
    SuccessResponse.send(res, respond)
  }
  checkLoginEmailToken = async (req, res) => {
    const { token = null } = req.query
    SuccessResponse.send(res, {
      message: 'verify token',
      metadata: await UserService.checkLoginEmailToken({
        token
      })
    })
  }
}

export const userController = new UserController