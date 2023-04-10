import OrderModel from '../models/order.model.js';

const allOrders = async () => {
    return await OrderModel.find({}).populate('user').lean();
};

export { allOrders };
