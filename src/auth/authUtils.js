import JWT from 'jsonwebtoken'
import { AuthFailureError, NotFoundError } from '~/core/error.response'
import { asyncHandler } from '~/helpers/asyncHandler'
import KeyTokenService from '~/services/keytoken.service'

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days'
    })

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days'
    })

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error('error verify::', err)
      } else {
        console.log('decode verify::', decode)
      }
    })

    return { accessToken, refreshToken }
  } catch (error) { /* empty */ }
}

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1 - Check userId
    2 - get accessToken
    3 - verify Token
    4 - check user in dbs
    5 - check keyStore with this userId
    6 - OK all => return next()
   */
  // 1
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid Request')
  // 2
  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) throw new NotFoundError('Not found keyStore')
  // 3
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError('Invalid Request')

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
    req.keyStore = keyStore

    return next()
  } catch (error) {
    throw error
  }
})

export {
  createTokenPair,
  authentication
}
