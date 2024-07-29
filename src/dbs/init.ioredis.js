import Redis from 'ioredis'
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
    console.log('connectionIORedis - Connection status: connected')
    clearTimeout(connectionTimeout)
  })
  connectionRedis.on(statusConnectRedis.END, () => {
    console.log('connectionIORedis - Connection status: disconnected')
    handleTimeoutError()
  })
  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log('connectionIORedis - Connection status: reconnecting')
    clearTimeout(connectionTimeout)
  })
  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log('connectionIORedis - Connection status: error' + err)
    handleTimeoutError()
  })
}

const initIORedis = ({
  IOREDIS_IS_ENABLED,
  IOREDIS_HOSTS = process.env.IOREDIS_CACHE_HOSTS,
  IOREDIS_PORT = 6379
}) => {
  if (IOREDIS_IS_ENABLED) {
    const instanceRedis = new Redis({
      host: IOREDIS_HOSTS,
      port: IOREDIS_PORT
    })
    client.instanceConnect = instanceRedis
    handleEventConnection({ connectionRedis: instanceRedis })
  }
}

const getIORedis = () => {
  if (!client) {
    throw new Error('Redis client has not been initialized. Please call initIORedis first.')
  }
  return client
}

const closeIORedis = () => {
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
  initIORedis,
  getIORedis,
  closeIORedis
}