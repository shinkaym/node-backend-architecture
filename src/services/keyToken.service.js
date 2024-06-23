/* eslint-disable no-undef */

import { keyTokenModel } from '~/models/keyToken.model'

class KeyTokenService {
  createKeyToken = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString()
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString
      })
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }
}

export const keyTokenService = new KeyTokenService