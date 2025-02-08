'use strict';

const { inventory } = require('../inventory.model');

const createInventory = async ( bodyCreat ) => {
    return await inventory.create( bodyCreat )
}

module.exports = {
    createInventory
}