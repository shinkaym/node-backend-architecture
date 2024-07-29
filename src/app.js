import 'dotenv/config'
import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import instanceMongodb from './dbs/init.mongodb'
import { checkOverload } from './helpers/check.connect'
import router from './routes'
import { v4 as uuidv4 } from 'uuid'
import myloggerLog from './loggers/mylogger.log'
import { initRedis } from './dbs/init.redis'
import { getIORedis, initIORedis } from './dbs/init.ioredis'

const app = express()

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  const requestId = req.headers['x-request-id']
  req.requestId = requestId ? requestId : uuidv4()
  myloggerLog.log(`input params::${req.method}::`, [
    req.path,
    { requestId: req.requestId },
    req.method === 'POST' ? req.body : req.query
  ])
  next()
})

// test pub sub
// import './tests/inventory.test'
// ProductServiceTest.purchaseProduct('product:001', 10)

// init db
instanceMongodb()
initRedis()
initIORedis({ IOREDIS_IS_ENABLED: true })

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
  const resMessage = `${error.status} - ${Date.now - error.now}ms - Response: ${JSON.stringify(error)}`
  myloggerLog.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    { message: error.message }
  ])

  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || 'Internal Server Error'
  })
})

export default app