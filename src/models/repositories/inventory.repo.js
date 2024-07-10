import InventoryModel from '~/models/inventory.model'
import { convertToObjectIdMongodb } from '~/utils'

const insertInventory = async ({ productId, shopId, stock, location = 'unknown' }) => {
  await InventoryModel.create({
    inven_productId: productId,
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopId
  })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectIdMongodb(productId),
      inven_stock: { $gte: quantity }
    }, updateSet = {
      $inc: {
        inven_stock: -quantity
      },
      $push: {
        inven_reservations: {
          quantity,
          cartId,
          createdAt: new Date()
        }
      }
    }, options = { upsert: true, new: true }

  return await InventoryModel.updateOne(query, updateSet, options)
}

export {
  insertInventory,
  reservationInventory
}