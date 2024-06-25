/* eslint-disable no-undef */
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { createTokenPair } from '~/auth/authUtils'
import { AuthFailureError, BadRequestError } from '~/core/error.response'
import { shopModel } from '~/models/shop.model'
import { getInfoData } from '~/utils'
import KeyTokenService from './keytoken.service'
import { findByEmail } from './shop.service'

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  /*
    1 - check email
    2 - match password
    3 - create AT vs RT and save
    4 - generate tokens
    5 - get data return login
   */

  static login = async ({ email, password, refreshToken = null }) => {
    //1 - check email
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Authentication error')

    //2 - match password
    const match = bcrypt.compare(password, foundShop.password)
    if (!match) throw new AuthFailureError('Authentication error')

    //3 - create AT vs RT and save
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    //4 - generate tokens
    const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      refreshToken: tokens.refreshToken,
      privateKey, publicKey
    })

    //5 - get data return login
    return {
      code: 201,
      metadata: {
        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
        tokens
      }
    }
  }

  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exist?
      const holderShop = await shopModel.findOne({ email }).lean()
      if (holderShop) {
        throw new BadRequestError('Error: Shop already registered!')
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const newShop = await shopModel.create({
        name, email, password: passwordHash, roles: [RoleShop.SHOP]
      })

      if (newShop) {
        // created publicKey, privateKey
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
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
        const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

        return {
          shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
          tokens
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

export default AccessService