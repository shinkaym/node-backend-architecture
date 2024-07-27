import { Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'Template'
const COLLECTION_NAME = 'Templates'

var templateSchema = new Schema({
  tem_id: { type: Number, required: true },
  tem_name: { type: String, required: true },
  tem_status: { type: String, default: 'active' },
  tem_html: { type: String, required: true }
},
{
  timestamps: true,
  collection: COLLECTION_NAME
}
)

const TemplateModel = model(DOCUMENT_NAME, templateSchema)

export default TemplateModel