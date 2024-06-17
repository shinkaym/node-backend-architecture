import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import instanceMongodb from './dbs/init.mongodb'
import { checkOverload } from './helpers/check.connect'

const app = express()

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// init db
instanceMongodb()
checkOverload()

// init routes
app.get('/', (req, res, next) => {
  return res.status(200).json({
    message: 'Welcome ShinKaym'
  })
})

// handling error

export default app