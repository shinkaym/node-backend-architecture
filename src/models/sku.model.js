import { Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'Sku'
const COLLECTION_NAME = 'Skus'

var skuSchema = new Schema({
  sku_id: { type: String, required: true, unique: true },
  sku_tier_id: { type: Array, default: [0] }, // [1, 0], [1, 1]
  /*
    color = [red, green] = [0, 1]
    size = [S, M] = [0, 1]
    red + S = [0, 0]
  */
  sku_default: { type: Boolean, default: false },
  sku_slug: { type: String, default: '' },
  sku_sort: { type: Number, default: 0 },
  sku_price: { type: String, required: true },
  sku_stock: { type: Number, default: 0 },
  product_id: { type: String, required: true },

  isDraft: { type: Boolean, default: true, index: true, select: false },
  isPublished: { type: Boolean, default: false, index: true, select: false },
  isDeleted: { type: Boolean, default: false }
},
{
  timestamps: true,
  collection: COLLECTION_NAME
}
)

const SkuModel = model(DOCUMENT_NAME, skuSchema)

export default SkuModel