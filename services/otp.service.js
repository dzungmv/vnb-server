'use strict';

import bcrypt from 'bcrypt';

import OTPModel from '../models/opt.model.js';

const insertOTP = async ({ otp, email }) => {
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
    return await OTPModel.create({ otp: hashedOTP, email });
};

const findOTPByEmail = async ({ email }) => {
    return await OTPModel.find({ email }).lean();
};

const deleteOTPByEmail = async ({ email }) => {
    return await OTPModel.findOneAndDelete({ email });
};

export { insertOTP, findOTPByEmail, deleteOTPByEmail };
