'use strict';

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require('../services/product.service');
class ProductController {
    /**
     * [POST] - /v1/api/product/create 
     * create new product
     * @param {*} req.body.product_type - type of product
     */
    async create ( req, res ) {
        new CREATED ({
            message: 'create success',
            metadata: await ProductService.createProduct( 
                req.body.product_type, {
                    ...req.body,
                    product_shop: req.user.userId,
                })
        }).send(res)
    }

    /**
     * [POST] - /v1/api/product/publish/:product_id 
     * publish this product
     */
    async publishProductByShop ( req, res ) {
        new SuccessResponse({
            message: 'publish product by shop success',
            metadata: await ProductService.publishProductByShop({ 
                product_id: req.params.product_id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    /**
     * [POST] - /v1/api/product/unpublish/:product_id 
     * un-publish this product
     */
    async unPublishProductByShop ( req, res ) {
        new SuccessResponse({
            message: "un publish product by shop success",
            metadata: await ProductService.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.product_id
            })
        }).send(res)
    }

    /**
     * [GET] - /v1/api/product/publish/all 
     * get all publish products 
     */
    async findAllPublishForShop ( req, res ) {
        new SuccessResponse({
            message: "get all drafts for shop success",
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId,
                ...req.query
            })
        }).send(res)
    }

    /**
     * [GET] - /v1/api/product/drafts/all 
     * get all draft products 
     */
    async findAllDraftsForShop ( req, res ) {
        new SuccessResponse({
            message: "get all drafts for shop success",
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId,
                ...req.query
            })
        }).send(res)
    }

    /**
     * route publish
     * [GET] - /v1/api/product/all 
     * get all products are published
     */
    async findAllProducts ( req, res ) {
        new SuccessResponse({
            message: 'get list find all product success',
            metadata: await ProductService.findAllProducts({
                ...req.query,
                filter: { isPublish: true } // mặc định luôn
            })
        }).send(res)
    }

    /**
     * [GET] - /v1/api/product/detail/:product_id 
     * get product is published 
     */
    async findProductById ( req, res ) {
        new SuccessResponse({
            message: 'get detail product success',
            metadata: await ProductService.findProductById( {
                product_id: req.params.product_id,
                ...req.query
            } ) // frornEnd muốn lấy thuoojc tinhs gì tự gửi query lên
        }).send(res)
    }

    /**
     * [PATCH] - /v1/api/product/update/:product_id 
     * update attributes of this product 
     */
    async updateProduct ( req, res ) {
        const payload = {
            productId: req.params.product_id,
            shopId: req.user.userId,
            bodyUpdate: req.body
        }
        const typeModel = req.body.product_type
        new SuccessResponse({
            message: 'update product success',
            metadata: await ProductService.updateProduct( typeModel, payload )
        }).send(res)
    }
}

module.exports = new ProductController;