import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
const app = express()

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// init db

// init routes
app.get('/', (req, res, next) => {
  return res.status(200).json({
    message: 'Welcome ShinKaym'
  })
})

// handling error

export default app