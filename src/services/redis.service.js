import { createClient } from 'redis'
import { promisify } from 'util'
import { getRedis, initRedis } from '~/dbs/init.redis'
import { reservationInventory } from '~/models/repositories/inventory.repo'

// const client = createClient()

// client.ping((err, result) => {
//   if (err) {
//     console.error('Error connecting to Redis::', err)
//   } else {
//     console.log('Connected to Redis')
//   }
// })
// const { instanceConnect: client } = getRedis()

// const pexpire = promisify(client.pexpire).bind(client)
// const setnxAsync = promisify(client.setnx).bind(client)

const acquireLock = async (productId, quantity, cartId) => {
  // const key = `lock_v2023_${productId}`
  // const retryTimes = 10
  // const expireTime = 3000

  // for (let i = 0; i < retryTimes; i++) {
  //   const result = await setnxAsync(key, expireTime)
  //   console.log('🚀 ~ acquireLock ~ result:', result)
  //   if (result === 1) {
  //     const isReservation = await reservationInventory({
  //       productId, quantity, cartId
  //     })
  //     if (isReservation.modifiedCount) {
  //       await pexpire(key, expireTime)
  //       return key
  //     }
  //     return null
  //   } else {
  //     await new Promise((resolve) => setTimeout(resolve, 50))
  //   }
  // }
}

const releaseLock = async keyLock => {
  // const delAsyncKey = promisify(client.del).bind(client)
  // return await delAsyncKey(keyLock)
}

export {
  acquireLock,
  releaseLock
}