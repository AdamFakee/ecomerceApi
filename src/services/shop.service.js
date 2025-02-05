'use strict'

const shopModel = require("../models/shop.model")

class shopService {
    static findByEmail = async ({ 
        email, 
        select = { email: 1, password: 2, name: 1, status: 1, roles: 1 }
    }) => {
        return await shopModel.findOne({ email }).select(select).lean() // dùng lean giúp data trả về nhẹ hơn 
    }
}

module.exports = shopService