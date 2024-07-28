import { Schema, model } from 'mongoose'
import slugify from 'slugify'

const DOCUMENT_NAME = 'Spus'
const COLLECTION_NAME = 'Spus'

var spuSchema = new Schema({
  product_id: { type: String, default: ''},
  product_name: { type: String, required: true },
  product_thumb: { type: String, required: true },
  product_description: String,
  product_slug: String,
  product_price: { type: Number, required: true },
  product_category: { type: Array, default: [] },
  product_quantity: { type: Number, required: true },
  // product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  product_attributes: { type: Schema.Types.Mixed, required: true },
  /*
    {
      attribute_id: 12345, style áo [hàn quốc, mùa hè, thời trang]
      attribute_value: [
        {
          valueId: 123
        }
      ]
    }
  */
  //more
  product_ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val) => Math.round(val * 10) / 10
  },
  product_variations: { type: Array, default: [] },
  /*
    tier_varation: [
      {
        images: [],
        name: 'color',
        options: ['red', 'green']
      },
      {
        images: [],
        name: 'size',
        options: ['S', 'M']
      }
    ]
   */
  isDraft: { type: Boolean, default: true, index: true, select: false },
  isPublished: { type: Boolean, default: false, index: true, select: false },
  isDeleted: { type: Boolean, default: false }
},
{
  timestamps: true,
  collection: COLLECTION_NAME
}
)
// create index for search
spuSchema.index({ product_name: 'text', product_description: 'text' })
// Middleware: runs before .save() and .create()
spuSchema.pre('save', function(next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

const SpuModel = model(DOCUMENT_NAME, spuSchema)

export default SpuModel