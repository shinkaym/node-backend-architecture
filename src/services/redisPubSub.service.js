import { createClient } from 'redis'

class RedisPubSubService {
  constructor() {
    this.subscriber = createClient()
    this.publisher = createClient()
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err)
        } else {
          resolve(reply)
        }
      })
    })
  }

  subscribe(channel, callback) {
    this.subscriber.subscribe(channel)
    this.subscriber.on('message', (subscriberChannel, message) => {
      if (channel === subscriberChannel) {
        callback(channel, message)
      }
    })
  }
}

const redisPubSubService = new RedisPubSubService()
export default redisPubSubService