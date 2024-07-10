import { BadRequestError } from '~/core/error.response'
import InventoryModel from '~/models/inventory.model'
import { getProductById } from '~/models/repositories/product.repo'

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location
  }) {
    const product = await getProductById(productId)
    if (!product) throw new BadRequestError('Product not exists!')

    const query = { inven_shopId: shopId, inven_productId: productId },
      updateSet = {
        $inc: {
          inven_stock: stock
        },
        $set: {
          inven_location: location
        }
      }, options = { upsert: true, new: true }

    return await InventoryModel.findOneAndUpdate(query, updateSet, options)
  }
}
  
export default InventoryService