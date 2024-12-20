/* eslint-disable no-undef */
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { createTokenPair, verifyJWT } from '~/auth/authUtils'
import { AuthFailureError, BadRequestError, ForbiddenError } from '~/core/error.response'
import { getInfoData } from '~/utils'
import KeyTokenService from './keyToken.service'
import ShopService from './shop.service'
import ShopModel from '~/models/shop.model'
import KeyTokenModel from '~/models/keyToken.model'

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static handlerRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId)
      throw new AuthFailureError('Something wrong happened !! Pls relogin')
    }

    if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered')

    const foundShop = await ShopService.findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registered')

    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)

    await KeyTokenModel.findOneAndUpdate(
      { _id: keyStore._id },
      {
        $set: {
          refreshToken: tokens.refreshToken
        },
        $addToSet: {
          refreshTokensUsed: refreshToken
        }
      })

    return {
      user,
      tokens
    }
  }

  static logout = async (keyStore) => {
    return await KeyTokenService.removeKeyById(keyStore._id)
  }

  /*
    1 - check email
    2 - match password
    3 - create AT vs RT and save
    4 - generate tokens
    5 - get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    //1 - check email
    const foundShop = await ShopService.findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Authentication error')

    //2 - match password
    const match = bcrypt.compare(password, foundShop.password)
    if (!match) throw new AuthFailureError('Authentication error')

    //3 - create AT vs RT and save
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    //4 - generate tokens
    const { _id: userId } = foundShop
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

    await KeyTokenService.createKeyToken({
      userId,
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
    // step1: check email exist?
    const holderShop = await ShopModel.findOne({ email }).lean()
    if (holderShop) {
      // throw new BadRequestError('Error: Shop already registered!')
      return BadRequestError('Error: Shop already registered!')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const newShop = await ShopModel.create({
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
  }
}

export default AccessService