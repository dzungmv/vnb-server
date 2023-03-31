'use strict';

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

export { findByEmail, verifyByEmail };
