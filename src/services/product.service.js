import { Types } from 'mongoose'
import { BadRequestError } from '~/core/error.response'
import { ClothingModel, ElectronicModel, ProductModel } from '~/models/product.model'

class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
    case 'Electronic': return new Electronic(payload).createProduct()
    case 'Clothing': return new Clothing(payload).createProduct()
    default: throw new BadRequestError('Invalid Product Types', type)
    }

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

export default ProductFactory