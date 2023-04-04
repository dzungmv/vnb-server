'use strict';
import mongoose from 'mongoose';
import CartModel from '../models/cart.model.js';
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
    // if product have name same size, update quantity of product instead of push new product
    const cart = await CartModel.findOne({ user: userId });
    if (cart) {
        const index = cart.products.findIndex(
            (item) =>
                item.product_name === product.product_name &&
                item.product_size.size_name === product.product_size.size_name
        );
        if (index !== -1) {
            cart.products[index].product_size.quantity =
                cart.products[index].product_size.quantity +
                product.product_size.quantity;
            const filters = { user: userId },
                update = { $set: { products: cart.products } },
                options = { upsert: true, new: true };
            return await CartModel.findOneAndUpdate(filters, update, options);
        }
    }
    const filters = { user: userId },
        update = { $push: { products: product } },
        options = { upsert: true, new: true };
    return await CartModel.findOneAndUpdate(filters, update, options);
};

export {
    findByEmail,
    verifyByEmail,
    updatePassword,
    addToCart,
    findCartByUserId,
};
