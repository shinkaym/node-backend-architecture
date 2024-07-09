import DiscountModel from '~/models/discount.model'
import { BadRequestError, NotFoundError } from '~/core/error.response'
import { convertToObjectIdMongodb } from '~/utils'
import { findAllProducts } from '~/models/repositories/product.repo'
import { checkDiscountExists, findAllDiscountCodesUnselect } from '~/models/repositories/discount.repo'

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      name, description, type, value, code, start_date, end_date, max_uses, uses_count,
      users_used, max_uses_per_user, min_order_value, shopId, is_active, applies_to, product_ids
    } = payload

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before end date!')
    }

    const foundDiscount = await DiscountModel.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId)
    }).lean()

    if (foundDiscount) {
      throw new BadRequestError('Discount exists!')
    }

    const newDiscount = await DiscountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: convertToObjectIdMongodb(shopId),

      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    })

    return newDiscount
  }

  static async updateDiscountCode() {

  }

  static async getAllDiscountCodesWithProduct({
    code, shopId, userId, limit, page
  }) {
    const foundDiscount = await DiscountModel.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId)
    }).lean()

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not exists!')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount

    let products
    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }
    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    return products
  }

  static async getAllDiscountCodesByShop({
    limit, page, shopId
  }) {
    const discounts = await findAllDiscountCodesUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true
      },
      unSelect: ['__v', 'discount_shopId'],
      model: DiscountModel
    })

    return discounts
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: DiscountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })

    if (!foundDiscount) throw new NotFoundError('Discount not exists!')

    const { discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_users_used,
      discount_start_date,
      discount_end_date,
      discount_max_uses_per_user,
      discount_type,
      discount_value
    } = foundDiscount

    if (!discount_is_active) throw new NotFoundError('Discount expired!')
    if (!discount_max_uses) throw new NotFoundError('Discount are out!')

    if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
      throw new NotFoundError('Discount ecode has expired!')
    }

    let totalOrder = 0
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      if (totalOrder < discount_min_order_value) throw new NotFoundError('Discount requires a minimum order value of', discount_min_order_value)
    }

    if (discount_max_uses_per_user > 0) {
      const userUsedDiscount = discount_users_used.find(user => user.userId === userId)
      if (userUsedDiscount) {
        // ...
      }
    }

    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    return await DiscountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId)
    })
  }

  static async cancelDiscountCode({ codeId, userId, shopId }) {
    const foundDiscount = await checkDiscountExists({
      model: DiscountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })

    if (!foundDiscount) throw new NotFoundError('Discount not exists!')

    return await DiscountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    })
  }
}

export default DiscountService
