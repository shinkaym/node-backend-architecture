import { SuccessResponse } from '~/core/success.response'
import DiscountService from '~/services/discount.service'

class DiscountController {
  createDiscountCode = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'generate code success!',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    })
  }

  getAllDiscountCodes = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'success code found!',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId
      })
    })
  }

  getDiscountAmount = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'success code found!',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body
      })
    })
  }

  getAllDiscountCodesWithProducts = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'success code found!',
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query
      })
    })
  }
}

export const discountController = new DiscountController