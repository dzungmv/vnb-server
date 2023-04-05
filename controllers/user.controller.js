import ProductModel from '../models/product.model.js';
import { addToCart, findCartByUserId } from '../services/user.service.js';

const CLIENT_ID = 'x-client-id';

const addCart = async (req, res) => {
    const userId = req.headers[CLIENT_ID];
    const { product } = req.body;

    try {
        const addProduct = await addToCart({ userId, product });

        if (!addProduct) {
            return res.status(400).json({
                success: false,
                message: 'Add product to cart failed',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Add product to cart successfully',
            data: addProduct,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

const getCart = async (req, res) => {
    const userId = req.headers[CLIENT_ID];

    try {
        const cart = await findCartByUserId(userId);

        if (!cart) {
            return res.status(400).json({
                success: false,
                message: 'Cart not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Get cart successfully',
            data: cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

const checkout = async (req, res) => {
    const { cart } = req.body;

    const userId = req.headers[CLIENT_ID];

    try {
        const productID = cart.map((item) => item.productId);

        const cartId = cart.map((item) => item._id);

        const products = await ProductModel.find({ _id: { $in: productID } });

        // check if quantity in cart is greater than quantity in stock of product in db or not exist in db
        const isOutOfStock = cart.filter((item) => {
            console.log(item, 'item-----');
            const productSizes = products.map((product) =>
                product.sizes.find(
                    (size) => size.size_name === item.product_size.size_name
                )
            );

            console.log(productSizes, 'productSizes--------');

            const isOutOfStock = productSizes.some(
                (size) => size.quantity < item.product_size.quantity
            );

            if (isOutOfStock) {
                return res.status(400).json({
                    success: false,
                    message: 'Product is out of stock',
                    productOutOfStock: isOutOfStock,
                    realQuantity: productSizes,
                });
            }

            // return productSizes.some(
            //     (size) => size.quantity < item.product_size.quantity
            // );
        });

        console.log(isOutOfStock, 'isOutOfStock');

        if (isOutOfStock) {
            return res.status(400).json({
                success: false,
                message: 'Product is out of stock',
                productOutOfStock: isOutOfStock,
            });
        }

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export default { addCart, getCart, checkout };
