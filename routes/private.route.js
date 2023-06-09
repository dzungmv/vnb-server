import express from 'express';

import { authenticate } from '../auth/authUtils.js';
import AuthController from '../controllers/auth.controller.js';
import ProductController from '../controllers/product.controller.js';
import UserController from '../controllers/user.controller.js';
import AdminController from '../controllers/admin.controller.js';

const router = express.Router();

const PrivateRoute = (app) => {
    router.use(authenticate);

    router.post('/product/add-product', ProductController.addProduct);
    router.put('/product/update-product/:id', ProductController.updateProduct);
    router.delete(
        '/product/delete-product/:id',
        ProductController.deleteProduct
    );

    router.get('/user/get-cart', UserController.getCart);
    router.get('/user/get-order', UserController.getOrder);
    router.post('/user/add-cart', UserController.addCart);
    router.post('/user/checkout', UserController.checkout);
    router.post('/user/order', UserController.order);
    router.put('/user/update-order', UserController.updateOrder);

    router.post('/auth/send-otp', AuthController.sendOTP);
    router.post('/auth/verify-account', AuthController.verifyAccount);
    router.post('/auth/change-password', AuthController.changePassword);
    router.post('/auth/logout', AuthController.signOut);
    router.post('/auth/refresh-token', AuthController.refreshToken);

    // Admin route
    router.get('/admin/get-all-orders', AdminController.getAllOrder);
    router.get('/admin/get-statistical', AdminController.getStatistical);
    router.patch('/admin/update-order/:id', AdminController.updateOrder);
    router.post('/admin/create-order', AdminController.createOrders);

    return app.use('/api/vnb/v1', router);
};

export default PrivateRoute;
