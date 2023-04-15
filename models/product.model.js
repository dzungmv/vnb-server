import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';
mongoose.plugin(slug);

const COLLECTION_NAME = 'Products';

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            slug: 'name',
        },
        image: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: [
                'racket',
                'shoes',
                'shirt',
                'skirt',
                'pant',
                'bag',
                'balo',
                'accessories',
            ],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        price_market: {
            type: Number,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        endows: {
            type: [String],
        },
        quantity: {
            type: Number,
            required: true,
        },
        stores: {
            type: [String],
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
