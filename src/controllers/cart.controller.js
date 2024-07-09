import { SuccessResponse } from '~/core/success.response'
import CartService from '~/services/cart.service'

class CartController {
  addToCart = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'create new cart success!',
      metadata: await CartService.addToCart(req.body)
    })
  }

  update = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'create new cart success!',
      metadata: await CartService.addToCartV2(req.body)
    })
  }

  delete = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'deleted cart success!',
      metadata: await CartService.deleteUserCart(req.body)
    })
  }

  listToCart = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'List cart success!',
      metadata: await CartService.getListUserCart(req.query)
    })
  }
}

export const cartController = new CartController