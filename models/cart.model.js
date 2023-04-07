import mongoose from 'mongoose';

const COLLECTION_NAME = 'Carts';

const CartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
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

                product_quantity: {
                    type: Number,
                },
            },
        ],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const CartModel = mongoose.model('Cart', CartSchema);

export default CartModel;
