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

export default { addCart, getCart };
