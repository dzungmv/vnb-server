import mongoose from 'mongoose';

const COLLECTION_NAME = 'Products';

const STATUS = {
    OUTSTOCK: 'outstock',
    INSTOCK: 'instock',
};

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        price_stock: {
            type: Number,
            required: true,
        },

        code: {
            type: String,
            required: true,
        },
        branch: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        endows: {
            type: [String],
        },
        sizes: {
            type: [],
            size_name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
        stores: {
            type: [],
            store_name: {
                type: String,
            },
            quantity: {
                type: Number,
            },
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const ProductModel = mongoose.model('Product', ProductSchema);

export default ProductModel;
