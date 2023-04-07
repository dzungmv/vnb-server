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
    const findUserCart = await CartModel.findOne({ user: userId });

    if (findUserCart) {
        const findProduct = findUserCart.products.find(
            (item) => item.productId == product.productId
        );

        if (findProduct) {
            const updateProduct = await CartModel.findOneAndUpdate(
                {
                    user: userId,
                    'products.productId': product.productId,
                },
                {
                    $set: {
                        'products.$.product_quantity': product.product_quantity,
                    },
                },
                {
                    new: true,
                }
            );

            return updateProduct;
        } else {
            const updateCart = await CartModel.findOneAndUpdate(
                {
                    user: userId,
                },
                {
                    $push: { products: product },
                },
                {
                    new: true,
                }
            );

            return updateCart;
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
