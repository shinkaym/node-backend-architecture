import { SuccessResponse } from '~/core/success.response'
import NotificationService from '~/services/notification.service'

class NotificationController {
  listNotiByUser = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'list noti success!',
      metadata: await NotificationService.listNotiByUser(req.query)
    })
  }
}

export const notificationController = new NotificationController