import { Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'Resource'
const COLLECTION_NAME = 'Resources'

var resourceSchema = new Schema({
  src_name: { type: String, required: true },
  src_slug: { type: String, required: true },
  src_description: { type: String, default: '' }
},
{
  timestamps: true,
  collection: COLLECTION_NAME
}
)

const ResourceModel = model(DOCUMENT_NAME, resourceSchema)

export default ResourceModel