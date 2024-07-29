import SkuModel from '~/models/sku.model'
import { randomProductId } from '~/utils'
import _ from 'lodash'
import { getCacheIO, setCacheIOExpiration } from '~/models/repositories/cache.repo'
const { CACHE_PRODUCT } = require('~/configs/constant')

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
      // chưa sửa khi use middleware 

      // 1. check params middleware
      if (sku_id < 0) return null
      if (product_id < 0) return null

      // 2. read cache
      const skuKeyCache = `${CACHE_PRODUCT.SKU}`(sku_id)
      let skuCache = await getCacheIO({ key: skuKeyCache })
      if (skuCache) {
        return {
          ...JSON.parse(skuCache),
          toLoad: 'cache'
        }
      }
      // 3. read from db
      if (!skuCache) {
        // 4. read from db
        skuCache = await SkuModel.findOne({
          sku_id, product_id
        }).lean()

        const valueCache = skuCache ? skuCache : null
        setCacheIOExpiration({
          key: skuKeyCache,
          value: JSON.stringify(valueCache),
          expirationInSeconds: 30
        })
      }

      return {
        skuCache,
        toLoad: 'dbs'
      }
      // // read cache
      // const sku = await SkuModel.findOne({
      //   sku_id,
      //   product_id
      // }).lean()

      // if (sku) {
      //   // set cached
      // }
      // return _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted'])
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