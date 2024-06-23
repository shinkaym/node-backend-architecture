/* eslint-disable no-undef */

import { keyTokenModel } from '~/models/keyToken.model'

class KeyTokenService {
  createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey,
        privateKey
      })
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }
}

export const keyTokenService = new KeyTokenService