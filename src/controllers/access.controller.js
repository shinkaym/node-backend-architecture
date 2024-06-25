import { CREATED, SuccessResponse } from '~/core/success.response'
import AccessService from '~/services/access.service'

class AccessController {
  login = async (req, res) => {
    SuccessResponse.send(res, {
      metadata: await AccessService.login(req.body)
    })
  }
  signUp = async (req, res) => {
    CREATED.send(res, {
      message: 'Registered OK!',
      metadata: await AccessService.signUp(req.body)
    })
  }
}

export const accessController = new AccessController