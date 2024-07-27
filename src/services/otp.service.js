import OtpModel from '~/models/otp.model'
import crypto from 'crypto'

class OtpService {
  static async generatorTokenRandom() {
    return crypto.randomInt(0, Math.pow(2, 32))
  }
  static async newOtp({
    email
  }) {
    const token = await this.generatorTokenRandom()
    return await OtpModel.create({
      otp_token: token,
      otp_email: email
    })
  }
  static async checkEmailToken({ token }) {
    const hasToken = await OtpModel.findOne({ otp_token: token })
    if (!token) throw new Error('token not found')
    OtpModel.deleteOne({ otp_token: token })
    return hasToken
  }
}

export default OtpService