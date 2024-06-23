/* eslint-disable no-console */
import app from '~/app'
import config from '~/configs/config.mongodb'

const PORT = config.app.port || 3055

const server = app.listen(PORT, () => {
  console.log('http://localhost:', PORT)
})

process.on('SIGINT', () => {
  server.close(() => console.log('Exit server successfully!'))
})