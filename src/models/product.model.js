import { Schema, model } from 'mongoose'
import slugify from 'slugify'

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

var productSchema = new Schema({
  product_name: { type: String, required: true },
  product_thumb: { type: String, required: true },
  product_description: String,
  product_slug: String,
  product_price: { type: Number, required: true },
  product_quantity: { type: Number, required: true },
  product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  product_attributes: { type: Schema.Types.Mixed, required: true },
  //more
  product_ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val) => Math.round(val * 10) / 10
  },
  product_variations: { type: Array, default: [] },
  isDraft: { type: Boolean, default: true, index: true, select: false },
  isPublished: { type: Boolean, default: false, index: true, select: false }
},
{
  timestamps: true,
  collection: COLLECTION_NAME
}
)
// create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })
// Middleware: runs before .save() and .create()
productSchema.pre('save', function(next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

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