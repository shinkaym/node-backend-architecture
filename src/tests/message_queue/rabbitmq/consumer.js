const amqp = require('amqplib')
// import amqp from 'amqplib'

const runConsumer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:guest@localhost')
    const channel = await connection.createChannel()

    const queueName = 'test-topic'
    await channel.assertQueue(queueName, {
      durable: true
    })

    channel.consume(queueName, (messages) => {
      console.log('🚀 ~ Received message:', messages.content.toString())
    }, { ack: true })
  } catch (error) {
    console.error(error)
  }
}

runConsumer().catch(console.error)