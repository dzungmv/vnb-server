import mongoose from 'mongoose';

const COLLECTION_NAME = 'Orders';

const Orders = new mongoose.Schema(
    {
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

                product_quantity: {
                    type: Number,
                },
            },
        ],
        fullname: {
            type: String,
        },
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
            enum: ['pending', 'shipping', 'completed', 'canceled', 'returned'],
            default: 'pending',
        },
        payment: {
            type: String,
            enum: ['cod', 'banking', 'cash'],
            default: 'cod',
        },
    },
    {
        timestamps: true,
    }
);

const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        orders: [
            {
                type: Orders,
            },
        ],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const OrderModel = mongoose.model('Order', OrderSchema);

export default OrderModel;
