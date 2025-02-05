'use strict';

const {StatusCodes, ReasonPhrases} = require('../utils/httpStatusCode');


class ErrorResponse extends Error {
    constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
        super(message);
        this.status = status;
    }

    send (res) {
        return res.send(this.status).json({
            message: this.message,
            status: this.status
        })
    }
}

class ForbiddenRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
        super(message, status);
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
        super(message, status);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN, additionalInfo = null) {
        const errorMessage = typeof message === 'string' ? message : JSON.stringify(message);
        super(errorMessage, status);
        this.additionalInfo = additionalInfo
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED) {
        super(message, status);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, status = StatusCodes.NOT_FOUND) {
        super(message, status);
    }
}
module.exports = {
    ErrorResponse,
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenRequestError
}