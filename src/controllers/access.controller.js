import { CREATED, SuccessResponse } from '~/core/success.response'
import AccessService from '~/services/access.service'

class AccessController {
  handlerRefreshToken = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'Get token success!',
      metadata: await AccessService.handlerRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      })
    })
  }
  logout = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'Logout success!',
      metadata: await AccessService.logout(req.keyStore)
    })
  }
  login = async (req, res) => {
    SuccessResponse.send(res, {
      metadata: await AccessService.login(req.body)
    })
  }
  // signUp = async (req, res) => {
  //   CREATED.send(res, {
  //     message: 'Registered OK!',
  //     metadata: await AccessService.signUp(req.body)
  //   })
  // }
  signUp = async (req, res) => {
    await AccessService.signUp(req.body)
  }
}

export const accessController = new AccessController