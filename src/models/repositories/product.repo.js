import { Types } from 'mongoose'
import { ProductModel } from '../product.model'

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch)
  const results = await ProductModel.find({
    isPublished: true,
    $text: { $search: regexSearch }
  }, {
    score: { $meta: 'textScore' }
  })
    .sort({ score: { $meta: 'textScore' } })
    .lean()

  return results
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const publishProductByShop = async ({ product_shop, product_id }) => {
  const filter = {
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  }
  const foundShop = await ProductModel.findOne(filter)
  if (!foundShop) return null

  const { modifiedCount } = await ProductModel.updateOne(filter, { isDraft: false, isPublished: true })
  return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const filter = {
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  }
  const foundShop = await ProductModel.findOne(filter)
  if (!foundShop) return null

  const { modifiedCount } = await ProductModel.updateOne(filter, { isDraft: true, isPublished: false })
  return modifiedCount
}

const queryProduct = async ({ query, limit, skip }) => {
  return await ProductModel.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

export {
  searchProductByUser,
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  queryProduct
}