'use strict';

const { ForbiddenRequestError } = require('../core/error.response');
const ApiKeyService = require('../services/apiKey.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async ( req, res, next ) => {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if(!key) {
        throw new ForbiddenRequestError('k gửi kèm x-api-key');
    }

    // check key existing
    const objKey = await ApiKeyService.findById(key);
    if(!objKey) {
        throw new ForbiddenRequestError('k tồn tại apiKey trong db');
    }

    req.objKey = objKey;
    return next();
}

const permissions = ( permission ) => {
    return ( req, res, next ) => {
        if(!req.objKey.permissions) {
            throw new ForbiddenRequestError('permission denied')
        }

        const validPermission = req.objKey.permissions.includes(permission);

        if(!validPermission) {
            throw new ForbiddenRequestError('permission denied')
        }

        return next();
    }
}
module.exports = {
    apiKey, permissions
}