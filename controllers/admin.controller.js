import { allOrders } from '../services/admin.service.js';

const getAllUsers = async (req, res) => {};

const getAllOrder = async (req, res) => {
    try {
        const orders = await allOrders();

        return res.status(200).json({
            success: true,
            message: 'Get all orders successfully',
            data: orders,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export default {
    getAllUsers,
    getAllOrder,
};
