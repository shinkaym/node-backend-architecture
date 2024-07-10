import { BadRequestError } from '~/core/error.response'
import { findCartById } from '~/models/repositories/cart.repo'
import { checkProductByServer } from '~/models/repositories/product.repo'
import DiscountService from './discount.service'
import { acquireLock, releaseLock } from './redis.service'
import OrderModel from '~/models/order.model'

class CheckoutService {
  // login and without login
  /*
    {
      cardId,
      userId,
      shop_order_ids: [
        {
          shopId,
          shop_discounts: [],
          item_products: [
            {
              price,
              quantity,
              productId
            }
          ]
        },
        {
          shopId,
          shop_discounts: [
            {
              shopId,
              discountId,
              codeId
            }
          ],
          item_products: [
            {
              price,
              quantity,
              productId
            }
          ]
        }
      ]
    }
  */
  static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
    const foundCart = await findCartById(cartId)
    if (!foundCart) throw new BadRequestError('Cart does not exist')

    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0
      }, shop_order_ids_new = []

    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]

      const checkProductServer = await checkProductByServer(item_products)
      console.log('🚀 ~ CheckoutService ~ checkReview ~ checkProductServer:', checkProductServer)
      if (!checkProductServer[0]) throw new BadRequestError('order wrong')

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer
      }

      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer
        })

        checkout_order.totalDiscount += discount
        console.log('🚀 ~ CheckoutService ~ checkoutReview ~ discount:', discount)

        if (discount > 0) itemCheckout.priceApplyDiscount = checkoutPrice - discount
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {}
  }) {
    const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
      cartId,
      userId,
      shop_order_ids
    })

    const products = shop_order_ids_new.flatMap(order => order.item_products)
    console.log('🚀 ~ CheckoutService ~ products:', products)

    const acquireProduct = []
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i]
      const keyLock = await acquireLock(productId, quantity, cartId)
      acquireProduct.push(keyLock ? true : false)
      if (keyLock) {
        await releaseLock(keyLock)
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError('Mot so san pham da dc cap nhat. vui long quay lai gio hang...')
    }

    const newOrder = await OrderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new
    })

    if (newOrder) {
      //
    }

    return newOrder
  }

  static async getOrdersByUser() {
    //
  }

  static async getOneOrderByUser() {
    //
  }

  static async cancelOrderByUser() {
    //
  }

  static async updateOrderStatusByShop() {
    //
  }
}

export default CheckoutService