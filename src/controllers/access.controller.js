import { CREATED } from '~/core/success.response'
import { accessService } from '~/services/access.service'

class AccessController {
  signUp = async (req, res) => {
    CREATED.send(res, {
      message: 'Registered OK!',
      metadata: await accessService.signUp(req.body)
    })
  }
}

export const accessController = new AccessController