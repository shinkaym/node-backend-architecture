import { Types } from 'mongoose'
import { BadRequestError } from '~/core/error.response'
import { ClothingModel, ElectronicModel, FurnitureModel, ProductModel } from '~/models/product.model'
import { findAllDraftsForShop, findAllProducts, findAllPublishForShop, findProduct, publishProductByShop, searchProductByUser, unPublishProductByShop, updateProductById } from '~/models/repositories/product.repo'
import { removeUndefinedObject, updateNestedObjectParser } from '~/utils'

class ProductFactory {
  static productRegister = {}

  static registerProductType(type, classRef) {
    ProductFactory.productRegister[type] = classRef
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegister[type]
    if (!productClass) throw new BadRequestError('Invalid Product Types', type)
    return new productClass(payload).createProduct()
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id })
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id })
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true }
    return await findAllDraftsForShop({ query, limit, skip })
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true }
    return await findAllPublishForShop({ query, limit, skip })
  }

  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch })
  }

  static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
    return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb'] })
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v'] })
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegister[type]
    if (!productClass) throw new BadRequestError('Invalid Product Types ', type)
    return new productClass(payload).updateProduct(productId)
  }
}

class Product {
  constructor({
    product_name, product_thumb, product_description, product_price, product_quantity,
    product_type, product_shop, product_attributes
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }

  async createProduct(product_id) {
    return await ProductModel.create({ ...this, _id: product_id })
  }

  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: ProductModel })
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await ClothingModel.create({
      ...this.product_attributes,
      product_shop: new Types.ObjectId(this.product_shop)
    })
    if (!newClothing) throw new BadRequestError('create new Clothing error')

    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw new BadRequestError('create new Product error')

    return newProduct
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this)
    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: ClothingModel
      })
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
    return updateProduct
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await ElectronicModel.create({
      ...this.product_attributes,
      product_shop: new Types.ObjectId(this.product_shop)
    })
    if (!newElectronic) throw new BadRequestError('create new Electronic error')

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError('create new Product error')

    return newProduct
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await FurnitureModel.create({
      ...this.product_attributes,
      product_shop: new Types.ObjectId(this.product_shop)
    })
    if (!newFurniture) throw new BadRequestError('create new Furniture error')

    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw new BadRequestError('create new Product error')

    return newProduct
  }
}

ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

export default ProductFactory