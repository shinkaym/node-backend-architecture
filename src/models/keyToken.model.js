import { Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

var keyTokenSchema = new Schema({
  user:{
    type: Schema.ObjectId,
    required: true,
    ref: 'Shop'
  },
  privateKey:{
    type: String,
    required: true
  },
  publicKey:{
    type: String,
    required: true
  },
  refreshToken:{
    type: String,
    required: true
  },
  refreshTokensUsed:{
    type: Array,
    default: []
  }
},
{
  timestamps: true,
  collection: COLLECTION_NAME
}
)

const KeyTokenModel = model(DOCUMENT_NAME, keyTokenSchema)

export default KeyTokenModel