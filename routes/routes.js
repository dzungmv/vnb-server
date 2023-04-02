import express from 'express';

import { authenticate } from '../auth/authUtils.js';
import AuthController from '../controllers/auth.controller.js';
import ProductController from '../controllers/product.controller.js';

const router = express.Router();

const AdminAPIRoute = (app) => {
    router.get('/product/get-all-product', ProductController.getAllProduct);
    router.get('/product/get-product/:slug', ProductController.getProduct);

    router.post('/auth/register', AuthController.signUp);
    router.post('/auth/login', AuthController.signIn);
    router.post('/auth/forgot-password', AuthController.forgotPassword);
    router.post('/auth/reset-password', AuthController.resetPassword);

    router.use(authenticate);

    router.post('/product/add-product', ProductController.addProduct);
    router.put('/product/update-product/:id', ProductController.updateProduct);
    router.delete(
        '/product/delete-product/:id',
        ProductController.deleteProduct
    );

    router.post('/auth/send-otp', AuthController.sendOTP);
    router.post('/auth/verify-account', AuthController.verifyAccount);
    router.post('/auth/change-password', AuthController.changePassword);
    router.post('/auth/logout', AuthController.signOut);
    router.post('/auth/refresh-token', AuthController.refreshToken);

    return app.use('/api/vnb/v1', router);
};

export default AdminAPIRoute;
