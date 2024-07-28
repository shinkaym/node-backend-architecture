import { NotFoundError } from '~/core/error.response'
import { findShopById } from '~/models/repositories/shop.repo'
import SpuModel from '~/models/spu.model'
import { randomProductId } from '~/utils'
import SkuService from './sku.service'
import _ from 'lodash'

class SpuService {
  static async newSpu({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_category,
    product_shop,
    product_attributes,
    product_quantity,
    product_variations,
    sku_list = []
  }) {
    try {
      // 1. check shop exists
      const foundShop = await findShopById({ shop_id: product_shop })
      if (!foundShop) throw new NotFoundError('Shop not found')

      // 2.create new spu
      const spu = await SpuModel.create({
        product_id: randomProductId(),
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_category,
        product_shop,
        product_attributes,
        product_quantity,
        product_variations
      })

      // 3.get spu_id add to sku.service
      if (spu && sku_list.length) {
        SkuService.newSku({ sku_list, spu_id: spu.product_id })
      }
      // 4. sync data via = elasticsearch (search.service)

      // 5. respond result object
      return !!spu
    } catch (error) {
      return error
    }
  }
  static async oneSpu({ spu_id }) {
    try {
      const spu = await SpuModel.findOne({ product_id: spu_id, isPublished: false }).lean()
      if (!spu) throw new NotFoundError('SPU not found')

      const skus = await SkuService.allSkuBySpuId({ product_id: spu.product_id })

      return {
        spu_info: _.omit(spu, ['__v', 'updatedAt']),
        sku_list: skus.map(sku => _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted']))
      }
    } catch (error) {
      return error
    }
  }
}

export default SpuService