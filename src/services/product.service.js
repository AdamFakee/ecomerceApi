'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { product, electronic, clothing } = require('../models/product.model');
const { publishProductByShop, unPublishProductByShop, findAllPublishForShop, findAllProducts, findProductById, findAllDraftsForShop, updateProductById } = require('../models/repositories/product.repo');
const { convertNestedObject, removeUndefinedObject, getInfoData } = require('../utils');

// define product factory
class ProductFactory {
    /**
     * @param { model } productRegister - contain modelName: model
     */
    static productRegister = {} 

    /**
     * 
     * @param { modelName } type - key in productRegister ( type of model in product )
     * @param { class } classRef - class interactive with this model
     */
    static registerProductType ( type, classRef ) {
        this.productRegister[type] = classRef;
    }

    /**
     * 
     * @param { modelName } type - key in productRegister ( type of model in product )
     * @param { mixed } payload - contain data to use creating new document of this model
     * @returns { new document }
     */
    static async createProduct ( type, payload ) {
        // cách này nếu muốn thêm 1 case mới => phải sửa code
        // switch ( type ) {
        //     case 'Electronics': 
        //         return new Electronic(payload).createElectronic();
        //     case 'Clothing':
        //         return new Clothing(payload).createClothing(); 
        // }
    
        /// xxxx
        const productClass = this.productRegister[type]; // class đã đăng kí
        if( !productClass ) {
            throw new BadRequestError(`Error::: invalit product type ${type}`)
        }
        return new productClass( payload ).createProduct()
    }

    /**
     * 
     * @param { modelName } type - key in productRegister ( type of model in product )
     * @param { mixed } payload - contain mixed data to use updating new document of this model
     * payload = {
     *   @param { string } productId - id of this updated product
     *   @param { string } shopId - id of shop that created this product
     *   @param { mixed } bodyUpdate - data used update this product
     * }
     * @returns - product after updated
     */
    static async updateProduct ( type, payload ) {
        const productClass = this.productRegister[type]
        if( !productClass ) {
            throw new BadRequestError(`Error::: invalit product type ${type}`)
        }
        const { productId, shopId, bodyUpdate } = payload
        return new productClass( bodyUpdate ).updateProduct({ productId, shopId})
    }

    /**
     * 
     * @param { string } product_shop - id of this updated product
     * @param { string } product_id - id of this product 
     * @returns - product after updated
     */
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id})
    }

    /**
     * 
     * @param { string } product_shop - id of this updated product
     * @param { string } product_id - id of this product 
     * @returns - product after updated
     */
    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }

    /**
     * 
     * @param { string } product_shop - id of this updated product
     * @returns - product after updated
     */
    static async findAllDraftsForShop({ product_shop, limit = 50, page = 1 }) {
        const query = { product_shop, isDraft: true};
        return await findAllDraftsForShop({ query, limit, page })
    }

    /**
     * 
     * @param { string } product_shop - id of this shop
     * @returns - product after updated
     */
    static async findAllPublishForShop({ product_shop, limit = 50, page = 1 }) {
        const query = { product_shop, isPublish: true}
        return await findAllPublishForShop({ query, limit, page })
    }

    /**
     * 
     * @param { string } sort - 'ctime' : sort by newest time
     * @param { object } filter - client can add filter in req.query.filter in url ( additional options )
     * @param { array[ string ] } select - selected fields that document return, can customs in url like 'req.query.select'
     * @returns - list products have 'isPublish: true' 
     */
    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter, select = [ 'product_name', 'product_thumb', 'product_price'] }) {
        return await findAllProducts({ limit, sort, page, filter, select })
    }

    /**
     * 
     * @param { array[ string ] } unSelect - un-selected fields that document return, can customs in url like 'req.query.unSelect'
     * @param { string } product_id - id of this product
     * @returns - product have 'isPublish: true' 
     */
    static async findProductById({ product_id, unSelect }) {
        const product = await findProductById({ product_id, unSelect })
        // k tìm thấy sản phẩm hoặc sản phẩm chưa publish
        if( !product ) {
            throw new NotFoundError('Not found')
        } 
        return product;
    }

}

// define product
class Product {
    constructor ({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    /**
     * 
     * @param { string } productId - id of this document in product model 
     * @returns 
     */
    async creatProduct (productId) {
        return await product.create({
            ...this,
            _id: productId
        });
    }

    /**
     * 
     * @param { string } productId - id of this updated product
     * @param { string } shopId - id of shop that created this product
     * @param { object } bodyUpdate - data used update this product
     * @param { model } model - modelName ( in function )
     * @returns - document of product model after updated 
     */
    async updateProduct({ productId, shopId, bodyUpdate }) {
        return await updateProductById({
            productId, shopId, bodyUpdate, model: product
        })
    }
}

class Clothing extends Product{
    async createProduct () {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if( !newClothing ) {
            throw new BadRequestError('Error::: create fail')
        }

        // id clothing = id product vì click vào => truy vấn luôn chứ k cần mò id mới
        // tuy nhiên chưa hiểu mục đích tách biệt attribute ra 1 collection riêng để làm gì trong khi xem chi tiết sản phẩm thì cũng cần link ảnh.....
        const newProduct = await super.creatProduct(newClothing._id);
        if( !newProduct ) {
            throw new BadRequestError('Error::: create product fail')
        }

        return newProduct;
    }

    /**
     * 
     * @param { string } productId - id of this updated product
     * @param { string } shopId - id of shop that created this product
     * @param { object } bodyUpdate - data used update this product
     * @param { model } model - modelName ( in function )
     * @returns - document of product model after updated 
     */
    async updateProduct({ productId, shopId }) {
        const convertObj = removeUndefinedObject(this)
        if( convertObj.product_attributes ) {
            await updateProductById({ 
                productId, shopId, 
                bodyUpdate: convertNestedObject( convertObj.product_attributes ), 
                model: clothing 
            })
        }
        return await super.updateProduct({
            productId, shopId, bodyUpdate: convertNestedObject( convertObj )
        })
    }
}

class Electronic extends Product{
    async createProduct () {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if( !newElectronic ) {
            throw new BadRequestError('Error::: create fail')
        }

        const newProduct = await super.creatProduct(newElectronic._id);
        if( !newProduct ) {
            throw new BadRequestError('Error::: create product fail')
        }

        return newProduct;
    }
    async updateProduct({ productId, shopId }) {
        const convertObj = removeUndefinedObject(this)
        if( convertObj.product_attributes ) {
            await updateProductById({ 
                productId, shopId, 
                bodyUpdate: convertNestedObject( convertObj.product_attributes ), 
                model: electronic 
            })
        }
        
        return await super.updateProduct({
            productId, shopId, bodyUpdate: convertNestedObject( convertObj )
        })
    }
}

// muốn sử dụng thì đăng kí class || productType mới 
ProductFactory.registerProductType( 'Electronics', Electronic );
ProductFactory.registerProductType( 'Clothing', Clothing );


module.exports = ProductFactory