const { default: ShopModel } = require('../shop.model')

const selectStruct = {
  email: 1, name: 1, status: 1, roles: 1
}

const findShopById = async ({ shop_id, select = selectStruct }) => {
  return await ShopModel.findById(shop_id).select(select)
}

export {
  findShopById
}