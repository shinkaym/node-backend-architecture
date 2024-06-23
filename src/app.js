import 'dotenv/config'
import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import instanceMongodb from './dbs/init.mongodb'
import { checkOverload } from './helpers/check.connect'
import router from './routes'

const app = express()

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// init db
instanceMongodb()
// checkOverload()

// init routes
app.use('', router)

// handling error

export default app