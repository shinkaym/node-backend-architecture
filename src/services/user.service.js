import { ConflictRequestError } from '~/core/error.response'
import UserModel from '~/models/user.model'
import EmailService from './email.service'
import OtpService from './otp.service'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { createUser } from '~/models/repositories/user.repo'
import KeyTokenService from './keyToken.service'
import { createTokenPair } from '~/auth/authUtils'
import { convertToObjectIdMongodb, getInfoData } from '~/utils'

class UserService {
  static async newUser({
    email = null,
    captcha = null
  }) {
    // thực tế tìm trong cache
    const user = await UserModel.findOne({ email }).lean()
    if (user) {
      return ConflictRequestError({
        message: 'Email already exists'
      })
    }

    const token = await EmailService.sendEmailToken({
      email
    })

    return {
      message: 'verify email user',
      metadata: {
        token
      }
    }
  }
  static async checkLoginEmailToken({ token }) {
    const { otp_email: email, otp_token } = await OtpService.checkEmailToken({ token })
    if (!email) throw new Error('Token not found')

    const hasUser = await this.findUserByEmailWithLogin({ email })
    if (hasUser) throw new Error('Email already exists')

    // new User
    const passwordHash = await bcrypt.hash(email, 10)
    const newUser = await createUser({
      usr_id: 1,
      usr_slug: 'dfjdsklfjs',
      usr_name: email,
      usr_email: email,
      usr_password: passwordHash,
      usr_role: convertToObjectIdMongodb('66a30982a864acc74bdf92c7')
    })

    if (newUser) {
      // created publicKey, privateKey
      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser.usr_id,
        publicKey,
        privateKey
      })

      if (!keyStore) {
        return {
          code: 'xxxx',
          message: 'publicKeyString error'
        }
      }

      // created token pair
      const tokens = await createTokenPair({ userId: newUser.usr_id, email }, publicKey, privateKey)

      return {
        user: getInfoData({ fields: ['usr_id', 'usr_name', 'usr_email'], object: newUser }),
        tokens
      }
    }
  }
  static async findUserByEmailWithLogin({ email }) {
    return await UserModel.findOne({ usr_email: email }).lean()
  }
}

export default UserService