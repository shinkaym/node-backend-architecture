import { SuccessResponse } from '~/core/success.response'

class ProfileController {
  profiles = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'Get profiles success',
      metadata: {
        profiles: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' }
        ]
      }
    })
  }
  profile = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'Get profile success',
      metadata: { id: 1, name: 'John Doe' }
    })
  }
}

export const profileController = new ProfileController
