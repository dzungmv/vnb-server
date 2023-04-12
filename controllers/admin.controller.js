import { allOrders, updateOrderByOrdersId } from '../services/admin.service.js';

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

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await updateOrderByOrdersId(id, status);

        // console.log(order);

        return res.status(200).json({
            success: true,
            message: 'Update order successfully',
            data: order,
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
    updateOrder,
};
