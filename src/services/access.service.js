/* eslint-disable no-undef */
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { createTokenPair } from '~/auth/authUtils'
import { shopModel } from '~/models/shop.model'
import { keyTokenService } from '~/services/keyToken.service'
import { getInfoData } from '~/utils'

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exist?
      const holderShop = await shopModel.findOne({ email }).lean()
      if (holderShop) {
        return {
          code: 'xxxx',
          message: 'Shop already registered!'
        }
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const newShop = await shopModel.create({
        name, email, password: passwordHash, roles: [RoleShop.SHOP]
      })

      if (newShop) {
        // created publicKey, privateKey
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem' 
          }
        })

        const publicKeyString = await keyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey
        })

        if (!publicKeyString) {
          return {
            code: 'xxxx',
            message: 'publicKeyString error'
          }
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString)

        // created token pair
        const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyObject, privateKey)
        console.log('🚀 ~ AccessService ~ signUp= ~ tokens:', tokens)

        return {
          code: 201,
          metadata: {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
            tokens
          }
        }
      }
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }
}

export const accessService = new AccessService