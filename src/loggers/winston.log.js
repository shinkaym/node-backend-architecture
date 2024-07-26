import winston from 'winston'

const { combine, timestamp, printf, align } = winston.format

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A'
    }),
    align(),
    printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ dirname: 'logs', filename: 'test.log' })
  ]
})

export default logger