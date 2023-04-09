'use strict';
import mongoose from 'mongoose';
import CartModel from '../models/cart.model.js';
import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';

const findByEmail = async ({
    email,
    select = {
        name: 1,
        password: 1,
        email: 1,
        role: 1,
        verified: 1,
    },
}) => {
    return await UserModel.findOne({ email }).select(select).lean();
};

const verifyByEmail = async (email) => {
    return await UserModel.findOneAndUpdate(
        email,
        {
            verified: true,
        },
        {
            new: true,
        }
    );
};

const updatePassword = async (email, password) => {
    return await UserModel.findOneAndUpdate(
        {
            email: email,
        },
        {
            password: password,
        },
        {
            new: true,
        }
    );
};

const findCartByUserId = async (userId) => {
    return await CartModel.findOne({ user: userId }).lean();
};

const addToCart = async ({ userId, product }) => {
    const findUserCart = await CartModel.findOne({ user: userId });

    if (findUserCart) {
        const findProduct = findUserCart.products.find(
            (item) => item.productId.toString() == product.productId
        );

        if (findProduct) {
            const index = findUserCart.products.indexOf(findProduct);
            findUserCart.products[index].product_quantity +=
                product.product_quantity;
            return await findUserCart.save();
        }
    }
    const filters = { user: userId },
        update = { $push: { products: product } },
        options = { upsert: true, new: true };
    return await CartModel.findOneAndUpdate(filters, update, options);
};

const removeFromCart = async (userId) => {
    return await CartModel.findOneAndDelete({ user: userId });
};

const findOrderByUserId = async (userId) => {
    return await OrderModel.findOne({ user: userId }).lean();
};

const createOrder = async ({ userId, data }) => {
    const { fullname, address, phone, products, total, payment } = data;
    return await OrderModel.findOneAndUpdate(
        {
            user: userId,
        },
        {
            $push: {
                orders: {
                    products,
                    fullname,
                    address,
                    phone,
                    total,
                    payment,
                },
            },
        },
        {
            new: true,
            upsert: true,
        }
    );
};

const getOrdersByUserId = async (userId) => {
    return await OrderModel.findOne({ user: userId }).lean();
};

export {
    findByEmail,
    verifyByEmail,
    updatePassword,
    addToCart,
    findCartByUserId,
    findOrderByUserId,
    createOrder,
    removeFromCart,
    getOrdersByUserId,
};
