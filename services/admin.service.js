import OrderModel from '../models/order.model.js';

const allOrders = async () => {
    return await OrderModel.find({}).populate('user').lean();
};

const updateOrder = async (orderId, status) => {
    const findUser = await OrderModel.findOne({
        _id: orderId,
    })
        .populate('user')
        .lean();
};
export { allOrders };
