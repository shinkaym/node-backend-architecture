const amqp = require('amqplib')
// import amqp from 'amqplib'

const messages = 'hello, RabbitMQ for Shinkaym'

const log = console.log
console.log = function() {
  log.apply(console, [new Date()].concat(arguments))
}

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:guest@localhost')
    const channel = await connection.createChannel()

    const notificationExchange = 'notificationEx'
    const notiQueue = 'notificationQueueProcess'
    const notificationExchangeDLX = 'notificationExDLX'
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'

    //1. create exchange
    await channel.assertExchange(notificationExchange, 'direct', { durable: true })
    //2. create queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false,
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX
    })
    //3. bind queue
    await channel.bindQueue(queueResult.queue, notificationExchange)
    //4. send message
    const msg = 'a new product'
    console.log('producer msg::', msg)
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), { expiration: '10000' })

    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 500)
  } catch (error) {
    console.error(error)
  }
}

runProducer().catch(console.error)