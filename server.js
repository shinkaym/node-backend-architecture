/* eslint-disable no-console */
import app from '~/app'

const PORT = process.env.PORT || 3055

const server = app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})

process.on('SIGINT', () => {
  server.close(() => console.log('Exit server successfully!'))
})