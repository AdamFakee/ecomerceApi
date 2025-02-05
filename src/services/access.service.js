'use strict';

const { generateKeyPair, createTokenPair, verifyToken } = require('../auth/authUtils');
const { AuthFailureError, BadRequestError, ForbiddenRequestError, NotFoundError } = require('../core/error.response');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const { getInfoData } = require('../utils');
const shopModel = require('../models/shop.model');
const { findByEmail } = require('./shop.service');
const KeyTokenService = require('./keyToken.service');
const shopService = require('./shop.service');

const roleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
};

class AccessService {
    static login = async ({email, password}) => {
        const foundShop = await shopService.findByEmail({email});
        if(!foundShop) {
            throw new BadRequestError("Error: Shop not registered");
        }

        const match = bcrypt.compare(password, foundShop.password);
        if(!match) throw new AuthFailureError("Authentication failed");

        const {publicKey, privateKey} = await generateKeyPair();

        const {_id: userId} = foundShop._id;
        const tokens = await createTokenPair(
            {userId, email},
            publicKey,
            privateKey
        )

        // save token + publicKey, privateKey
        await KeyTokenService.createKeyToken({
            userId, publicKey, privateKey, refreshToken: tokens.refreshToken
        })

        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop
            }),
            tokens
        }
    }

    static signUP = async ({ name, email, password }) => {
        const holderShop = await shopModel.findOne({ email }).lean();

        if(holderShop) {
            throw new BadRequestError('Error: Shop already exists');
        }

        const passwordHash = await bcrypt.hash(password, 8);
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [ roleShop.SHOP ]
        })

        if(newShop) {
            // create public key, private key
            const {publicKey, privateKey} = await generateKeyPair();

            // create token pair
            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKey,
                privateKey
            )
            // save publicKey into db
            const publicKeyString = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey, privateKey,
                refreshToken: tokens.refreshToken
            })

            if(!publicKeyString) throw new BadRequestError('Error::: publicKeyString');


            

            return {
                shop: getInfoData({
                    fields: ['_id', 'name', 'email'],
                    object: newShop
                }),
                tokens
            }
        }

        return {
            status: 200,
            metadata: null
        }
    }

    static logout = async (keyToken) => {
        const delKey = await KeyTokenService.removeById(keyToken._id);
        return delKey;
    }

    static handleRefreshToken = async ( refreshToken ) => {
        /* 
            1. find refreshToken is used in db or not?

            if true:
                2. verify token ( take userId )
                3. delete keyToken with this userId
                4. throw alter
            else: 
                2. find refreshToken
                3. create new token
                4. update db
                5. return 

        */
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        if(foundToken) {
            const { userId } = await verifyToken( refreshToken, foundToken.privateKey );
            await KeyTokenService.deleteByUserId( userId );
            throw new ForbiddenRequestError('Error::: something wrong!! Pls re-login');
        }

        // keyToken of shop in keyTokenModel
        const holderShop = await KeyTokenService.findByRefreshToken( refreshToken );
        if( !holderShop ) {
            throw new AuthFailureError('Error::: something wrong!! Pls re-login')
        }
        
        // verify token
        const { userId, email } = await verifyToken( refreshToken, holderShop.publicKey );
        const foundShop = await shopService.findByEmail({ email });
        if( !foundShop ) {
            throw new AuthFailureError('Error::: shop not register')
        }

        // create new token
        console.log(holderShop)
        const tokens = await createTokenPair(
            { userId: foundShop._id, email },
            holderShop.publicKey,
            holderShop.privateKey
        )

        // update refresh token
        await KeyTokenService.update({
            id: holderShop._id,
            refreshToken: tokens.refreshToken
        })

        return {
            user: { userId, email},
            tokens
        }
    }
}

module.exports = AccessService;