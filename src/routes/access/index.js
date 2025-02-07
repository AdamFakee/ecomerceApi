'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler.helper');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

router.post('/signup', asyncHandler(accessController.signUp));
router.post('/login', asyncHandler(accessController.login));

// authentication
router.use(authentication);

//////////
router.post('/logout', asyncHandler(accessController.logout));
router.post('/handleRefreshToken', asyncHandler(accessController.handleRefreshToken));

module.exports = router;