import OrderModel from '../models/order.model.js';
import ProductModel from '../models/product.model.js';

const allOrders = async () => {
    return await OrderModel.find({}).populate('user').lean();
};

const updateOrderByOrdersId = async (orderId, status) => {
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
export { allOrders, updateOrderByOrdersId };
