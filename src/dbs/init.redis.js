import { createClient } from 'redis'
import { RedisErrorResponse } from '~/core/error.response'

const statusConnectRedis = {
  CONNECT: 'connect',
  END: 'end',
  RECONNECT: 'reconnecting',
  ERROR: 'error'
}

let client = {}, connectionTimeout

const REDIS_CONNECT_TIMEOUT = 10000, REDIS_CONNECT_MESSAGE = {
  code: -99,
  message: {
    vn: 'Redis lỗi rồi!',
    en: 'Redis error!'
  }
}

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisErrorResponse({
      message: REDIS_CONNECT_MESSAGE.message.en,
      statusCode: REDIS_CONNECT_MESSAGE.code
    })
  }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnection = ({ connectionRedis }) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log('connectionRedis - Connection status: connected')
    clearTimeout(connectionTimeout)
  })
  connectionRedis.on(statusConnectRedis.END, () => {
    console.log('connectionRedis - Connection status: disconnected')
    handleTimeoutError()
  })
  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log('connectionRedis - Connection status: reconnecting')
    clearTimeout(connectionTimeout)
  })
  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log('connectionRedis - Connection status: error' + err)
    handleTimeoutError()
  })
}

const initRedis = () => {
  const instanceRedis = createClient()
  client.instanceConnect = instanceRedis
  handleEventConnection({ connectionRedis: instanceRedis })
}

const getRedis = () => {
  if (!client) {
    throw new Error('Redis client has not been initialized. Please call initRedis first.')
  }
  return client
}

const closeRedis = () => {
  if (client.instanceConnect) {
    client.instanceConnect.quit((err, res) => {
      if (err) {
        console.log('Error closing the Redis connection:', err)
      } else {
        console.log('Redis connection closed successfully:', res)
      }
    })
  }
}

export {
  initRedis,
  getRedis,
  closeRedis
}