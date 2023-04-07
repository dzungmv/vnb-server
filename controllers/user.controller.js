import mongoose from 'mongoose';
import ProductModel from '../models/product.model.js';
import { addToCart, findCartByUserId } from '../services/user.service.js';

const CLIENT_ID = 'x-client-id';

const getCart = async (req, res) => {
    const userId = req.headers[CLIENT_ID];

    try {
        const cart = await findCartByUserId(userId);

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

        const userCarts = await findCartByUserId(userId);

        return res.status(200).json({
            success: true,
            message: 'Add product to cart successfully',
            data: userCarts,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

const checkout = async (req, res) => {
    const { cart } = req.body;

    const userId = req.headers[CLIENT_ID];

    try {
        const productID = cart.map((item) => item.productId);

        const products = await ProductModel.find({ _id: { $in: productID } });

        // check if quantity in cart is greater than quantity in stock of product in db or not exist in db

        let realStock = [];

        const isOutOfStock = cart.filter((item) => {
            const isOutQuantity = products.filter((product) => {
                return (
                    product._id.toString() === item.productId.toString() &&
                    product.quantity < item.product_quantity
                );
            });

            if (isOutQuantity && isOutQuantity.length > 0) {
                isOutQuantity.map((item) => {
                    return realStock.push({
                        _id: item._id,
                        name: item.name,
                        quantity: item.quantity,
                    });
                });
            }

            return isOutQuantity;
        });

        if (isOutOfStock.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Products has outstock!',
                type: 'out_of_stock',
                stock: realStock,
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
