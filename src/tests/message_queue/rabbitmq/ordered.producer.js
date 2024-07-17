const amqp = require('amqplib')

async function producerOrderedMessage() {
  const conn = await amqp.connect('amqp://guest:guest@localhost')
  const channel = await conn.createChannel()

  const queueName = 'ordered-queued-message'
  await channel.assertQueue(queueName, { durable: true })

  for (let i = 0; i < 10; i++) {
    const message = `Message ${i + 1}`
    console.log(` [x] Sent ${message}`)
    await channel.sendToQueue(queueName, Buffer.from(message), { persistent: true })
  }

  setTimeout(() => conn.close(), 1000 )
}

producerOrderedMessage().catch(err => console.error(err))