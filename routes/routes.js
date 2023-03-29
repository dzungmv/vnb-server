import express from 'express';

import { authenticate } from '../auth/authUtils.js';
import AuthController from '../controllers/auth.controller.js';
import ProductController from '../controllers/product.controller.js';

const router = express.Router();

const AdminAPIRoute = (app) => {
    router.post('/product/add-product', ProductController.addProduct);

    router.post('/auth/register', AuthController.signUp);
    router.post('/auth/login', AuthController.signIn);

    router.use(authenticate);

    router.post('/auth/logout', AuthController.signOut);
    router.post('/auth/refresh-token', AuthController.refreshToken);

    return app.use('/api/vnb/v1', router);
};

export default AdminAPIRoute;
