import {
    allOrders,
    updateOrderByOrdersId,
    createOrder,
    getRevenuez,
    getAllUser,
} from '../services/admin.service.js';

const CLIENT_ID = 'x-client-id';

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
        const { status, total } = req.body;

        const order = await updateOrderByOrdersId(id, status, total);

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

const createOrders = async (req, res) => {
    const { data } = req.body;
    const admin = req.headers[CLIENT_ID];

    try {
        const order = await createOrder({ admin, data });

        if (!order) {
            return res.status(400).json({
                success: false,
                message: 'Create order failed',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Create order successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

const getStatistical = async (req, res) => {
    try {
        const revenue = await getRevenuez();

        const users = await getAllUser();

        const orders = await allOrders();

        return res.status(200).json({
            success: true,
            message: 'Get revenue successfully',
            data: {
                revenue: revenue,
                users: users.length,
                orders: orders.length,
            },
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
    getAllOrder,
    getStatistical,
    updateOrder,
    createOrders,
};
