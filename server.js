/* eslint-disable no-console */
import app from '~/app'
import mongodbConfig from '~/configs/mongodb.config'

const PORT = mongodbConfig.app.port || 3055

const server = app.listen(PORT, () => {
  console.log('http://localhost:', PORT)
})

process.on('SIGINT', () => {
  server.close(() => console.log('Exit server successfully!'))
})