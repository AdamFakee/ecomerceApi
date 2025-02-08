"use strict";

const { model, Schema } = require('mongoose'); // Erase if already required


const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
const productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required:true,
    },
    product_description: String,
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true, 
        enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    // lưu data để hiển thị sơ bộ 1 2 thuộc tính 
    // còn nếu vào chi tiết sản phẩm thì truy vấn theo id để xem chi tiết sản phẩm 
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
    // chứa các thông tin về từng phiên bản của sản phẩm
    /*
        [
            "màu đỏ": {
                ram: 64,
                thumbnail: 'xxxx'
            }
        ]
    */
    product_variations: {
        type: Array,
        default: []
    },
    // bản nháp của productproduct
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false // thuộc tính k show ra khi find
    },
    // publish product
    isPublish: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// define the product type = clothing
const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
}, {
    collection: 'Clothings',
    timestamps: true
})

// define the product type = clothing
const electronicSchema = new Schema({
    manufacturer: {
        type: String,
        required: true
    },
    model: String,
    color: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
}, {
    collection: 'Electronics',
    timestamps: true
})


//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model( "Electronic", electronicSchema),
    clothing: model( 'Clothing', clothingSchema)
}