'use strict';

const express = require('express');
const { apiKey, permissions } = require('../auth/checkAuth');
const asyncHandler = require('../helpers/asyncHandler.helper');
const router = express.Router();


// khi shop hay doanh nghiệp đăng kí mở tài khoản thì sẽ tạo api key cho họ  - test nên bỏ qua 
// // check api key
// router.use(asyncHandler(apiKey));

// // check permission
// router.use(permissions('0000'));
router.use('/v1/api/product', require('./product'));
router.use('/v1/api/', require('./access'));

module.exports = router;