const amqp = require('amqplib')
// import amqp from 'amqplib'

const messages = 'hello, RabbitMQ for Shinkaym'

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:guest@localhost')
    const channel = await connection.createChannel()

    const queueName = 'test-topic'
    await channel.assertQueue(queueName, {
      durable: true
    })

    channel.sendToQueue(queueName, Buffer.from(messages))
    console.log('🚀 ~ Send message:', messages)
  } catch (error) {
    console.error(error)
  }
}

runProducer().catch(console.error)