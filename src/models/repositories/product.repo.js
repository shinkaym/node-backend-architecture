import { Types } from 'mongoose'
import { ProductModel } from '../product.model'
import { getSelectData, unGetSelectData } from '~/utils'

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

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  return await ProductModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
}

const findProduct = async ({ product_id, unSelect }) => {
  return await ProductModel.findById(product_id).select(unGetSelectData(unSelect))
}

export {
  searchProductByUser,
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  queryProduct,
  findAllProducts,
  findProduct
}