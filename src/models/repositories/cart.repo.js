import { convertToObjectIdMongodb } from '~/utils'
import CartModel from '../cart.model'

const findCartById = async (cartId) => {
  return await CartModel.findOne({ _id: convertToObjectIdMongodb(cartId), cart_state: 'active' }).lean()
}

export {
  findCartById
}