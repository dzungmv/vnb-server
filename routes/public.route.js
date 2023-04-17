import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import ProductController from '../controllers/product.controller.js';

const router = express.Router();
const PublicRoute = (app) => {
    router.get('/product/get-products', ProductController.getAllProduct);
    router.get('/product/get-product/:slug', ProductController.getProduct);
    router.post('/product/search-products', ProductController.searchProduct);
    router.post('/auth/register', AuthController.signUp);
    router.post('/auth/login', AuthController.signIn);
    router.post('/auth/forgot-password', AuthController.forgotPassword);
    router.post('/auth/reset-password', AuthController.resetPassword);
    router.post('/auth/send-otp', AuthController.sendOTP);

    return app.use('/api/vnb/v1', router);
};

export default PublicRoute;
