import myloggerLog from '~/loggers/mylogger.log'
// import logger from '~/loggers/winston.log'
import { ReasonPhrases, StatusCodes } from '~/utils/httpStatusCode'

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
    this.now = Date.now()
    // logger.error(`${this.status} - ${this.message}`)
    // myloggerLog.error(this.message, {
    //   context: '/path',
    //   requestId: 'KKKKK',
    //   message: this.message,
    //   metadata: {}
    // })
    // myloggerLog.error(this.message, ['/api/v1/login', 'vv33344', { error: 'Bad request error' }])
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT) {
    super(message, statusCode)
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.BAD_REQUEST, statusCode = StatusCodes.BAD_REQUEST) {
    super(message, statusCode)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
    super(message, statusCode)
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
    super(message, statusCode)
  }
}

export {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError
}