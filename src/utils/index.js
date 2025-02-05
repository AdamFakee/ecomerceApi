'use strict';


const _ = require('lodash');

// filter data with specificed fields
const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
}

module.exports = {
    getInfoData
}