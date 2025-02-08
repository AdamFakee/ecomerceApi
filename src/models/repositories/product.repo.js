'use strict';

const ObjectId = require('mongoose').Types.ObjectId;
const {product, electronic, clothing, furniture} = require('../../models/product.model');
const { unGetSelectData, getSelectData } = require('../../utils');

const findAllDraftsForShop = async ({ query, limit, page }) => {
    return await queryProduct({ query, limit, page })
}

const findAllPublishForShop = async ({ query, limit, page }) => {
    return await queryProduct({ query, limit, page })
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new ObjectId(product_shop),
        _id: new ObjectId(product_id)
    });

    if(!foundShop) return null

    foundShop.isDraft = false;
    foundShop.isPublish = true;

    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return {modifiedCount};
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new ObjectId(product_shop),
        _id: new ObjectId(product_id)
    });

    if(!foundShop) return null

    foundShop.isDraft = true;
    foundShop.isPublish = false;

    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return {modifiedCount};
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const filterEdited = {
        ...filter,
        isPublish: true
    }
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }; 
    const products = await product.find(filterEdited)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData( select ))
        .lean();

    return products;
}

const findProductById = async ({ product_id, unSelect = [] }) => {
    const query = { _id: product_id, isPublish: true }
    const unSelectEdited = [ '__v', 'createdAt', 'updatedAt', ...unSelect ] 
    console.log(unSelectEdited)
    return await product.findOne(query).select(unGetSelectData( unSelectEdited ));
}

const queryProduct = async ({ query, limit, page }) => {
    const skip = ( page - 1 ) * limit;
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
}

const updateProductById = async ({ productId, shopId, bodyUpdate, model }) => {
    const filter = {
        _id: productId,
        product_shop: shopId
    }
    const options = { new: true }
    return await model.findOneAndUpdate( filter, bodyUpdate, options )
}
module.exports = {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    findAllProducts,
    findProductById,
    updateProductById
}