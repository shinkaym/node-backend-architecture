import { Types } from 'mongoose'
import KeyTokenModel from '~/models/keyToken.model'

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // level 0
      // const tokens = await KeyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // })
      // return tokens ? tokens.publicKey : null

      //level xxx
      const filter = { user: userId }, update = {
          publicKey, privateKey, refreshTokensUsed: [], refreshToken
        }, options = { upsert: true, new: true }

      const tokens = await KeyTokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }

  static findByUserId = async (userId) => {
    return await KeyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
  }

  static removeKeyById = async (id) => {
    return await KeyTokenModel.deleteOne({ _id: id })
  }

  static findByRefreshTokensUsed = async (refreshToken) => {
    return await KeyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
  }

  static findByRefreshToken = async (refreshToken) => {
    return await KeyTokenModel.findOne({ refreshToken }).lean()
  }

  static deleteKeyById = async (userId) => {
    return await KeyTokenModel.findOneAndDelete({ user: new Types.ObjectId(userId) })
  }
}

export default KeyTokenService