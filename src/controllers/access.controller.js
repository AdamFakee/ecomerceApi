'use strict';

const { BadRequestError, ErrorResponse } = require("../core/error.response");
const { SuccessResponse, CREATED } = require("../core/success.response");
const AccessService = require("../services/access.service");



class AccessController {
    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login successfully',
            metadata: await AccessService.login( req.body )
        }).send(res)
    }

    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered successfully',
            metadata: await AccessService.signUP(req.body)
        }).send(res);
    }

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'logout success',
            metadata: await AccessService.logout(req.keyToken)
        }).send(res)
    }

    handleRefreshToken = async (req, res, next) => {
        console.log(req.body.refreshToken)
        new SuccessResponse({
            message: 'refreshToken success',
            metadata: await AccessService.handleRefreshToken( req.body.refreshToken )
        }).send(res)
    }
}

module.exports = new AccessController();