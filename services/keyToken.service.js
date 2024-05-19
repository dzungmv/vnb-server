'use strict';
import mongoose from 'mongoose';

import KeyModel from '../models/keytoken.model.js';

const createToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
        const filters = { user: userId },
            update = {
                publicKey,
                privateKey,
                refreshTokensUsed: []
                refreshToken,
            },
            option = {
                upsert: true,
                new: true,
            };

        const tokens = await KeyModel.findOneAndUpdate(filters, update, option);

        return tokens ? tokens.publicKey : null;
    } catch (error) {
        return error;
    }
};

const findById = async (userId) => {
    return await KeyModel.findOne({
        user: new mongoose.Types.ObjectId(userId),
    }).lean();
};

const removeById = async (id) => {
    return await KeyModel.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
    });
};

const findRefreshTokenIsUsed = async (refreshToken) => {
    return await KeyModel.findOne({
        refreshTokensUsed: refreshToken,
    }).lean();
};

const findRefreshToken = async (refreshToken) => {
    return await KeyModel.findOne({
        refreshToken,
    });
};

const updateRefreshToken = async ({
    refreshTokenOld,
    refreshToken,
    userId,
}) => {
    return await KeyModel.findOneAndUpdate(
        {
            user: new mongoose.Types.ObjectId(userId),
        },
        {
            $push: {
                refreshTokensUsed: refreshTokenOld,
            },
            refreshToken: refreshToken,
        }
    );
};

const deleteKeyById = async (userId) => {
    return await KeyModel.deleteOne({
        user: new mongoose.Types.ObjectId(userId),
    });
};

export {
    createToken,
    findById,
    removeById,
    findRefreshTokenIsUsed,
    deleteKeyById,
    findRefreshToken,
    updateRefreshToken,
};
