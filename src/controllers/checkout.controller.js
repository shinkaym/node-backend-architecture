import { SuccessResponse } from '~/core/success.response'
import CheckoutService from '~/services/checkout.service'

class CheckoutController {
  checkoutReview = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'checkout review success!',
      metadata: await CheckoutService.checkoutReview(req.body)
    })
  }
}

export const checkoutController = new CheckoutController