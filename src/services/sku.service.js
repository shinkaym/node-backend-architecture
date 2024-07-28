import SkuModel from '~/models/sku.model'
import { randomProductId } from '~/utils'
import _ from 'lodash'

class SkuService {
  static async newSku({
    spu_id, sku_list
  }) {
    try {
      const convert_sku_list = sku_list.map(sku => {
        return { ...sku, product_id: spu_id, sku_id: `${spu_id}.${randomProductId()}` }
      })
      return await SkuModel.create(convert_sku_list)
    } catch (error) {
      return error
    }
  }

  static async oneSku({ sku_id, product_id }) {
    try {
      // read cache
      const sku = await SkuModel.findOne({
        sku_id,
        product_id
      }).lean()

      if (sku) {
        // set cached
      }
      return _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted'])
    } catch (error) {
      return error
    }
  }
  static async allSkuBySpuId({ product_id }) {
    try {
      return await SkuModel.find({ product_id }).lean()
    } catch (error) {
      return error
    }
  }
}

export default SkuService