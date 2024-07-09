import { Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

var inventorySchema = new Schema({
  inven_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  inven_location: { type: String, default: 'unknown' },
  inven_stock: { type: Number, required: true },
  inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
  inven_reservations: { type: Array, default: [] }
},
{
  timestamps: true,
  collection: COLLECTION_NAME
}
)

const InventoryModel = model(DOCUMENT_NAME, inventorySchema)

export default InventoryModel