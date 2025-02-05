'use strict';

const JWT = require('jsonwebtoken');
const {generateKeyPairSync} = require('node:crypto');
const asyncHandler = require('../helpers/asyncHandler.helper');
const { ForbiddenRequestError, AuthFailureError, NotFoundError } = require('../core/error.response');
const KeyTokenService = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const generateKeyPair = async () => {
    const {
       publicKey,
       privateKey,
    } = generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });

    return {
        publicKey, privateKey
    };
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // access token
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2h'
        })

        // refresh token
        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '30 days'
        })

        // test verify
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`Error verifying:: ${err.message}`)
            } else {
                console.log(`Decoded:`, decode)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new Error(`Error verifying:: ${error.message}`)
    }
}

const authentication = asyncHandler( async ( req, res, next ) => {
    /*
        1. check userId missing?
        2. check accessToken
        3. check user in dbs
        4. check keyStore with this userId
        5. ok all => return next
    */
    const userId = req.headers[HEADER.CLIENT_ID];
    if(!userId) {
        throw new AuthFailureError('Error::: userId missing')
    }

    const keyToken = await KeyTokenService.findByUserId(userId);
    if(!keyToken) {
        throw new NotFoundError('Error::: user is not exists')
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) {
        throw new AuthFailureError('Error::: accessToken missing')
    }

    try {
        const decoded = JWT.verify(accessToken, keyToken.publicKey);
        if(decoded.userId !== userId) {
            throw new AuthFailureError('Error::: invalid token')
        }
        
        req.keyToken = keyToken;
        next();
    } catch (error) {
        console.log(accessToken)
        throw error
    }
})

const verifyToken = async ( token, publicKey ) => {
    return await JWT.verify(token, publicKey);
}
module.exports = {
    createTokenPair, generateKeyPair, authentication, verifyToken
}