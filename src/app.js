import 'dotenv/config'
import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import instanceMongodb from './dbs/init.mongodb'
import { checkOverload } from './helpers/check.connect'
import router from './routes'
import ProductServiceTest from './tests/product.test'

const app = express()

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import './tests/inventory.test'
ProductServiceTest.purchaseProduct('product:001', 10)

// init db
instanceMongodb()
// checkOverload()

// init routes
app.use('', router)

// handling error
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || 'Internal Server Error'
  })
})

export default app