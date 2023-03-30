import bcrypt from 'bcrypt';
import { log } from 'console';
import crypto from 'crypto';

import { createTokenPair } from '../auth/authUtils.js';
import UserModel from '../models/user.model.js';
import {
    createToken,
    deleteKeyById,
    removeById,
    updateRefreshToken,
} from '../services/keyToken.service.js';

import { findByEmail } from '../services/user.service.js';

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

        console.log(findUser);

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
                    id: findUser._id,
                    name: findUser.name,
                    email: findUser.email,
                    role: findUser.role,
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

export default {
    signUp,
    signIn,
    signOut,
    refreshToken,
};
