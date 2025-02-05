'use strict';

const {StatusCodes, ReasonPhrases} = require('../utils/httpStatusCode');

class SuccessResponse {
    constructor({ message, status = StatusCodes.OK, reasonStatus = ReasonPhrases.OK, metadata = {} }) {
        this.message = !message ? reasonStatus : message;
        this.status = status;
        this.metadata = metadata;
    }

    send (res) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata}) {
        super({message, metadata});
    }
}

class CREATED extends SuccessResponse {
    constructor ({options = {}, message, status = StatusCodes.CREATED, reasonStatus = ReasonPhrases.CREATED, metadata }) {
        super({ message, status, reasonStatus, metadata});
        this.options = options;
    }
}

module.exports = {
    OK, CREATED, SuccessResponse
}

