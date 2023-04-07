import mongoose from 'mongoose';

const COLLECTION_NAME = 'Orders';

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },

                product_name: {
                    type: String,
                },

                product_image: {
                    type: String,
                },

                product_price: {
                    type: Number,
                },

                product_size: {
                    size_name: {
                        type: String,
                    },
                    quantity: {
                        type: Number,
                    },
                },
            },
        ],
        address: {
            type: String,
        },
        phone: {
            type: String,
        },
        total: {
            type: Number,
        },
        status: {
            type: String,
            enum: ['pending', 'shipping', 'delivered', 'canceled'],
            default: 'pending',
        },
        payment: {
            type: String,
            enum: ['cod', 'banking'],
            default: 'cod',
        },
        payment_status: {
            type: String,
            enum: ['pending', 'success', 'failed'],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);
