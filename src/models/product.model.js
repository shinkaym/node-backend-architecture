import { Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

var productSchema = new Schema({
  product_name: { type: String, required: true },
  product_thumb: { type: String, required: true },
  product_description: String,
  product_price: { type: Number, required: true },
  product_quantity: { type: Number, required: true },
  product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  product_attributes: { type: Schema.Types.Mixed, required: true }
},
{
  timestamps: true,
  collection: COLLECTION_NAME
}
)

const clothingSchema = new Schema({
  brand: { type: String, require: true },
  size: String,
  material: String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
},
{
  timestamps: true,
  collection: 'Clothes'
})

const electronicSchema = new Schema({
  manufacturer: { type: String, require: true },
  model: String,
  color: String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
},
{
  timestamps: true,
  collection: 'Electronics'
})

const furnitureSchema = new Schema({
  brand: { type: String, require: true },
  size: String,
  material: String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
},
{
  timestamps: true,
  collection: 'Furnitures'
})

const ProductModel = model(DOCUMENT_NAME, productSchema)
const ElectronicModel = model('Electronic', electronicSchema)
const ClothingModel = model('Clothing', clothingSchema)
const FurnitureModel = model('Furniture', furnitureSchema)

export {
  ProductModel,
  ElectronicModel,
  ClothingModel,
  FurnitureModel
}