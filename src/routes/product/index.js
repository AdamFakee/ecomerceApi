'use strict';

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler.helper');
const ProductController = require('../../controllers/product.controller');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();


router.get('/detail/:product_id', asyncHandler( ProductController.findProductById ))
router.get('/all', asyncHandler( ProductController.findAllProducts ))

// authentication routes
router.use(authentication)
//////
router.post('/create', asyncHandler( ProductController.create ));
router.post('/publish/:product_id', asyncHandler( ProductController.publishProductByShop ))
router.post('/unpublish/:product_id', asyncHandler( ProductController.unPublishProductByShop ))
router.patch('/update/:product_id', asyncHandler( ProductController.updateProduct ))
// query routes
router.get('/drafts/all', asyncHandler( ProductController.findAllDraftsForShop ))
router.get('/publish/all', asyncHandler( ProductController.findAllPublishForShop ))
module.exports = router;