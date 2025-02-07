'use strict';

const apiKeyModel = require("../models/apiKey.model");

class ApiKeyService {
    static findById = async ( key ) => {
        const objKey  = await apiKeyModel.findOne({
            key,
            status: true
        });
        return objKey;
    }
}

module.exports = ApiKeyService;