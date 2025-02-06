'use strict';

const keyTokenModel = require('../models/keyToken.model');

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // const publicKeyString = publicKey.toString();
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey: publicKeyString
            // });

            const filter = {
                user: userId
            }, update = {
                user: userId,
                publicKey, 
                privateKey,
                refreshToken,
                refreshTokenUsed: []
            }, options = {
                upsert: true, // nếu không tồn tại => tạo mới luôn
                new: true // trả về dữ liệu sau khi cập nhật
            }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }
    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({user: userId})
    }
    static removeById = async (id) => {
        return await keyTokenModel.deleteOne(id);
    }
    static deleteByUserId = async ( userId ) => {
        return await keyTokenModel.deleteOne({ user: userId });
    }
    static findByRefreshTokenUsed = async ( refreshToken ) => {
        return await keyTokenModel.findOne({ refreshTokenUsed : refreshToken });
    }
    static findByRefreshToken = async ( refreshToken ) => {
        return await keyTokenModel.findOne({ refreshToken });
    }
    static update = async ({ id ,refreshToken, refreshTokenUsed }) => {
        return await keyTokenModel.updateOne({
            _id: id
        },{
            $set: {
                refreshToken: refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshTokenUsed
            }
        })
    }
}

module.exports = KeyTokenService;