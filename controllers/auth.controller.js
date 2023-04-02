import bcrypt from 'bcrypt';
import crypto from 'crypto';
import otpGenerator from 'otp-generator';

import { createTokenPair } from '../auth/authUtils.js';
import UserModel from '../models/user.model.js';
import {
    createToken,
    deleteKeyById,
    removeById,
    updateRefreshToken,
} from '../services/keyToken.service.js';
import {
    deleteOTPByEmail,
    findOTPByEmail,
    insertOTP,
} from '../services/otp.service.js';

import {
    findByEmail,
    verifyByEmail,
    updatePassword,
} from '../services/user.service.js';
import { sendEmail } from '../utils/mailer.js';

const ROLE = {
    ADMIN: 'admin',
    USER: 'user',
};

const signUp = async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const holderEmail = await UserModel.findOne({ email }).lean();

        if (holderEmail) {
            return res.status(400).json({
                message: 'Email already exists',
            });
        }

        const passHash = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            email,
            name,
            password: passHash,
            role: ROLE.USER,
        });

        if (user) {
            const publicKey = crypto.randomBytes(64).toString('hex');
            const privateKey = crypto.randomBytes(64).toString('hex');

            // Save public and private key to database as string
            const keyStore = await createToken({
                userId: user._id,
                publicKey,
                privateKey,
            });

            if (!keyStore) {
                return res.status(500).json({
                    message: 'keyStore error',
                });
            }

            // Create token pair: accesstoken and refreshtoken
            const tokens = await createTokenPair(
                { userId: user._id, email },
                publicKey,
                privateKey
            );

            return res.status(201).json({
                message: 'User regitered successfully!',
                metadata: {
                    user: user,
                    tokens,
                },
            });
        }

        return res.status(200).json({
            metadata: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

const signIn = async (req, res) => {
    const { email, password, refreshToken = null } = req.body;

    try {
        const findUser = await findByEmail({ email });

        if (!findUser) {
            return res.status(401).json({
                message: 'User not registered!',
            });
        }

        const passwordMatch = await bcrypt.compare(password, findUser.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Password is invalid!',
            });
        }

        // Create new key pair: acessToken and refreshToken
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const tokens = await createTokenPair(
            { userId: findUser._id, email },
            publicKey,
            privateKey
        );

        // Save public and private key to database as string
        await createToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId: findUser._id,
        });

        return res.status(200).json({
            message: 'Login successfully!',
            metadata: {
                user: {
                    _id: findUser._id,
                    name: findUser.name,
                    email: findUser.email,
                    role: findUser.role,
                    verified: findUser.verified,
                },
                tokens,
            },
        });
    } catch (error) {
        console.error('Error', error);
        return res.status(500).json({
            message: 'Internal server!',
        });
    }
};

const signOut = async (req, res) => {
    const delKey = await removeById(req.keyStore._id);

    return res.status(200).json({
        message: 'Logout successfully!',
        delKey,
    });
};

const refreshToken = async (req, res) => {
    const { refreshToken, user, keyStore } = req;

    const { userId, email } = user;

    try {
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await deleteKeyById(userId);
            return res.status(401).json({
                message: 'Token expired, please login again!',
            });
        }

        if (keyStore.refreshToken !== refreshToken) {
            return res.status(401).json({
                message: 'User not registered!',
            });
        }

        const findUser = await findByEmail({ email });

        if (!findUser) {
            return res.status(401).json({
                message: 'User not registered 2!',
            });
        }

        const tokens = await createTokenPair(
            { userId, email },
            keyStore.publicKey,
            keyStore.privateKey
        );

        // update refresh token
        await updateRefreshToken({
            refreshTokenOld: refreshToken,
            refreshToken: tokens.refreshToken,
            userId,
        });

        return res.status(200).json({
            message: 'Refresh token successfully!',
            metadata: {
                user: {
                    id: findUser._id,
                    name: findUser.name,
                    email: findUser.email,
                },
                tokens,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error!',
            error: error,
        });
    }
};

const sendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const OTP = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        await insertOTP({ otp: OTP, email });

        await sendEmail({
            to: email,
            subject: 'Verify your email',
            htmlContent: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #ff0050;text-decoration:none;font-weight:600">VNB Shop</a>
              </div>
              <p style="font-size:1.1em">Hi,</p>
              <p>Thank you for choosing VNB. Use the following OTP to complete your verify account. OTP is valid for 60 seconds.</p>
              <h2 style="background: #ff0050;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
              <p style="font-size:0.9em;">Regards,<br />VNB Shop</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>VNB Shop Inc</p>
                <p>Ho Chi Minh City</p>
              </div>
            </div>
          </div>`,
        });

        return res.status(200).json({
            message: 'Send OTP successfully!',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error!',
        });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const findUser = await findByEmail({ email });

        if (!findUser) {
            return res.status(404).json({
                message: 'User not found!',
            });
        }

        const OTP = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        await insertOTP({ otp: OTP, email });

        await sendEmail({
            to: email,
            subject: 'Reset password',
            htmlContent: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #ff0050;text-decoration:none;font-weight:600">VNB Shop</a>
              </div>
              <p style="font-size:1.1em">Hi,</p>
              <p>Use the following OTP to reset your password. OTP is valid for 60 seconds.</p>
              <h2 style="background: #ff0050;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
              <p style="font-size:0.9em;">Regards,<br />VNB Shop</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>VNB Shop Inc</p>
                <p>Ho Chi Minh City</p>
              </div>
            </div>
          </div>`,
        });

        return res.status(200).json({
            message: 'Send OTP successfully!',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error!',
        });
    }
};

const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    try {
        const findOTP = await findOTPByEmail({ email });

        if (!findOTP) {
            return res.status(401).json({
                message: 'OTP is invalid!',
            });
        }

        const findUser = await findByEmail({ email });

        if (!findUser) {
            return res.status(401).json({
                message: 'User not registered!',
            });
        }

        // get last record of otp
        const lastOTP = findOTP[findOTP.length - 1];
        const OTP = lastOTP.otp;

        const isMatch = await bcrypt.compare(otp, OTP);

        if (!isMatch) {
            return res.status(401).json({
                message: 'OTP is invalid!',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const test = await updatePassword(email, hashPassword);

        return res.status(200).json({
            message: 'Reset password successfully!',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error!',
        });
    }
};

const verifyAccount = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const findOTP = await findOTPByEmail({ email });

        if (!findOTP) {
            return res.status(401).json({
                message: 'OTP is invalid 1!',
            });
        }

        const findUser = await findByEmail({ email });

        if (!findUser) {
            return res.status(401).json({
                message: 'User not registered!',
            });
        }

        if (findUser.verified) {
            return res.status(401).json({
                message: 'User is verified!',
            });
        }

        // get last record of otp
        const lastOTP = findOTP[findOTP.length - 1];
        const OTP = lastOTP.otp;

        const isMatch = await bcrypt.compare(otp, OTP);

        if (!isMatch) {
            return res.status(401).json({
                message: 'OTP is invalid 2!',
            });
        }

        const verify = await verifyByEmail({ email });

        await deleteOTPByEmail({ email });

        return res.status(200).json({
            message: 'Verify account successfully!',
            metadata: {
                verify,
            },
        });
    } catch (error) {
        console.error('Error', error);
        return res.status(500).json({
            message: 'Internal server error!',
        });
    }
};

const changePassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        await updatePassword(email, hashPassword);
        return res.status(200).json({
            message: 'Change password successfully!',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Cant not change password!',
        });
    }
};

export default {
    signUp,
    signIn,
    signOut,
    refreshToken,
    sendOTP,
    verifyAccount,
    forgotPassword,
    changePassword,
    resetPassword,
};
