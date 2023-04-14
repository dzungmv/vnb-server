import OrderModel from '../models/order.model.js';
import ProductModel from '../models/product.model.js';
import RevenueModel from '../models/revenue.model.js';
import UserModel from '../models/user.model.js';

const allOrders = async () => {
    return await OrderModel.find({}).populate('user').lean();
};

const getRevenuez = async () => {
    return await RevenueModel.findOne({}).lean();
};

const getAllUser = async () => {
    // count all user
    return await UserModel.find({}).lean();
};

const updateOrderByOrdersId = async (orderId, status, total) => {
    // pass array userId to find orders by ordersId
    // status is shipping, set quantity of product in order to -1
    if (status === 'shipping') {
        const findOrder = await OrderModel.findOne(
            {
                orders: {
                    $elemMatch: {
                        _id: orderId,
                    },
                },
            },
            {
                'orders.$': 1,
            },
            {
                new: true,
            }
        )
            .populate('user')
            .lean();
        // console.log('check', findOrder.orders[0].products);

        await findOrder.orders[0].products.map(async (product) => {
            return await ProductModel.findOneAndUpdate(
                {
                    _id: product.productId,
                },
                {
                    $inc: {
                        quantity: -product.product_quantity,
                    },
                },
                {
                    new: true,
                }
            );
        });

        const updateOrder = await OrderModel.findOneAndUpdate(
            {
                orders: {
                    $elemMatch: {
                        _id: orderId,
                    },
                },
            },
            {
                $set: {
                    'orders.$.status': status,
                },
            },
            {
                new: true,
            }
        )
            .populate('user')
            .lean();

        return updateOrder;
    }

    if (status === 'completed') {
        console.log('check>>>>>', total);
        //    sum total of order to revenue
        await RevenueModel.findOneAndUpdate(
            {
                date: new Date().toISOString().slice(0, 10),
            },
            {
                $inc: {
                    amount: total,
                },
            },
            {
                new: true,
                upsert: true,
            }
        );
        return await OrderModel.findOneAndUpdate(
            {
                orders: {
                    $elemMatch: {
                        _id: orderId,
                    },
                },
            },
            {
                $set: {
                    'orders.$.status': status,
                },
            },
            {
                new: true,
            }
        )
            .populate('user')
            .lean();
    }

    if (status === 'returns') {
        const findOrder = await OrderModel.findOne(
            {
                orders: {
                    $elemMatch: {
                        _id: orderId,
                    },
                },
            },
            {
                'orders.$': 1,
            },
            {
                new: true,
            }
        )
            .populate('user')
            .lean();

        await findOrder.orders[0].products.map(async (product) => {
            return await ProductModel.findOneAndUpdate(
                {
                    _id: product.productId,
                },
                {
                    $inc: {
                        quantity: +product.product_quantity,
                    },
                },
                {
                    new: true,
                }
            );
        });

        return await OrderModel.findOneAndUpdate(
            {
                orders: {
                    $elemMatch: {
                        _id: orderId,
                    },
                },
            },
            {
                $set: {
                    'orders.$.status': status,
                },
            },
            {
                new: true,
            }
        )
            .populate('user')
            .lean();
    }

    return await OrderModel.findOneAndUpdate(
        {
            orders: {
                $elemMatch: {
                    _id: orderId,
                },
            },
        },
        {
            $set: {
                'orders.$.status': status,
            },
        },
        {
            new: true,
        }
    )
        .populate('user')
        .lean();
};

const createOrder = async ({ admin, data }) => {
    const { fullname, phone, products, total, payment } = data;

    return await OrderModel.findOneAndUpdate(
        {
            user: admin,
        },
        {
            $push: {
                orders: {
                    products,
                    fullname,
                    phone,
                    total,
                    payment,
                    status: 'completed',
                },
            },
        },
        {
            new: true,
            upsert: true,
        }
    );
};
export {
    allOrders,
    updateOrderByOrdersId,
    createOrder,
    getRevenuez,
    getAllUser,
};
