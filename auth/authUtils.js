'use strict';
import jwt from 'jsonwebtoken';

import asyncHandler from '../helpers/asyncHandler.js';
import { findById } from '../services/keyToken.service.js';

const HEADERS = {
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
    REFRESH_TOKEN: 'x-refresh-token',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await jwt.sign(payload, publicKey, {
            expiresIn: '2 days',
        });

        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: '7 days',
        });

        jwt.verify(accessToken, publicKey, (error, decode) => {
            if (error) {
                console.error('error verify', error);
            } else {
                console.error('decode verify', decode);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {}
};

const authenticate = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.headers[HEADERS.CLIENT_ID];
        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized!',
            });
        }

        const keyStore = await findById(userId);

        if (!keyStore) {
            return res.status(401).json({
                message: 'Not found key store!',
            });
        }

        if (req.headers[HEADERS.REFRESH_TOKEN]) {
            try {
                const refreshToken = req.headers[HEADERS.REFRESH_TOKEN];
                const decode = await jwt.verify(
                    refreshToken,
                    keyStore.privateKey
                );
                if (decode.userId !== userId) {
                    return res.status(401).json({
                        message: 'Invalid user id!',
                    });
                }

                req.keyStore = keyStore;
                req.user = decode;
                req.refreshToken = refreshToken;

                return next();
            } catch (error) {
                throw new Error('Unauthorized!');
            }
        }

        const accessToken = req.headers[HEADERS.AUTHORIZATION];
        if (!accessToken) {
            return res.status(401).json({
                message: 'Unauthorized!',
            });
        }

        try {
            const decode = await jwt.verify(accessToken, keyStore.publicKey);
            if (decode.userId !== userId) {
                return res.status(401).json({
                    message: 'Invalid user id!',
                });
            }

            req.keyStore = keyStore;
            return next();
        } catch (error) {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized!',
            });
        }
    } catch (error) {
        next(error);
    }
});

const verifyJWT = async (token, keySecrect) => {
    return await jwt.verify(token, keySecrect);
};

export { createTokenPair, authenticate, verifyJWT };
