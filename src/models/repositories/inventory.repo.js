import InventoryModel from '~/models/inventory.model'

const insertInventory = async ({ productId, shopId, stock, location = 'unknown' }) => {
  await InventoryModel.create({
    inven_productId: productId,
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopId
  })
}

export {
  insertInventory
}