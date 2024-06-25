import { ReasonPhrases, StatusCodes } from '~/utils/httpStatusCode'

class SuccessResponse {
  constructor({ message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata = {} }) {
    this.message = message || reasonStatusCode
    this.status = statusCode
    this.metadata = metadata
  }

  static send(res, { message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata = {} }) {
    return res.status(statusCode).json({
      message: message || reasonStatusCode,
      status: statusCode,
      metadata
    })
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata })
  }

  static send(res, { message, metadata }) {
    return super.send(res, {
      message,
      statusCode: StatusCodes.OK,
      reasonStatusCode: ReasonPhrases.OK,
      metadata
    })
  }
}

class CREATED extends SuccessResponse {
  constructor({ message, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metadata }) {
    super({ message, statusCode, reasonStatusCode, metadata })
  }

  static send(res, { message, metadata }) {
    return super.send(res, {
      message,
      statusCode: StatusCodes.CREATED,
      reasonStatusCode: ReasonPhrases.CREATED,
      metadata
    })
  }
}

export {
  SuccessResponse,
  OK,
  CREATED
}
