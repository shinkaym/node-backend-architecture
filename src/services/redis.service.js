import { createClient } from 'redis'
import { promisify } from 'util'
import { reservationInventory } from '~/models/repositories/inventory.repo'

const client = createClient()

const promisifyCustom = (client, method) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      client[method](...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}

const pexpire = promisify(client.pexpire).bind(client)
const setnxAsync = promisify(client.setnx).bind(client)

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`
  const retryTimes = 10
  const expireTime = 3000

  for (let i = 0; i < retryTimes; i++) {
    const result = await setnxAsync(key, expireTime)
    console.log('🚀 ~ acquireLock ~ result:', result)
    if (result === 1) {
      const isReservation = await reservationInventory({
        productId, quantity, cartId
      })
      if (isReservation.modifiedCount) {
        await pexpire(key, expireTime)
        return key
      }
      return null
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

const releaseLock = async keyLock => {
  const delAsyncKey = promisify(client.del).bind(client)
  return await delAsyncKey(keyLock)
}

export {
  acquireLock,
  releaseLock
}