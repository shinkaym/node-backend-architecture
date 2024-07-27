import { Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'Otp_Log'
const COLLECTION_NAME = 'Otp_Logs'

var otpSchema = new Schema({
  otp_token: { type: String, required: true },
  otp_email: { type: String, required: true },
  otp_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
  expireAt: { type: Date, default: Date.now, expires: 60 }
},
{
  timestamps: true,
  collection: COLLECTION_NAME
}
)

const OtpModel = model(DOCUMENT_NAME, otpSchema)

export default OtpModel