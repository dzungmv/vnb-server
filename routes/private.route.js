import express from 'express';

import { authenticate } from '../auth/authUtils.js';
import AuthController from '../controllers/auth.controller.js';
import ProductController from '../controllers/product.controller.js';
import UserController from '../controllers/user.controller.js';
import AdminController from '../controllers/admin.controller.js';

const router = express.Router();

const PrivateRoute = (app) => {
    router.use(authenticate);

    /**
     * @swagger
     * tags:
     *   name: Private
     *   description: Các API riêng tư
     */

    /**
     * @swagger
     * /api/vnb/v1/product/add-product:
     *   post:
     *     summary: Thêm sản phẩm
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       description: Thông tin sản phẩm mới
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               price:
     *                 type: number
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.post('/product/add-product', ProductController.addProduct);

    /**
     * @swagger
     * /api/vnb/v1/product/update-product/{id}:
     *   put:
     *     summary: Cập nhật thông tin sản phẩm
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID của sản phẩm
     *         schema:
     *           type: string
     *     requestBody:
     *       description: Thông tin cập nhật sản phẩm
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               price:
     *                 type: number
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.put('/product/update-product/:id', ProductController.updateProduct);

    /**
     * @swagger
     * /api/vnb/v1/product/delete-product/{id}:
     *   delete:
     *     summary: Xóa sản phẩm
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID của sản phẩm
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.delete(
        '/product/delete-product/:id',
        ProductController.deleteProduct
    );

    /**
     * @swagger
     * /api/vnb/v1/user/get-cart:
     *   get:
     *     summary: Lấy giỏ hàng của người dùng
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.get('/user/get-cart', UserController.getCart);

    /**
     * @swagger
     * /api/vnb/v1/user/get-order:
     *   get:
     *     summary: Lấy đơn hàng của người dùng
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.get('/user/get-order', UserController.getOrder);

    /**
     * @swagger
     * /api/vnb/v1/user/add-cart:
     *   post:
     *     summary: Thêm sản phẩm vào giỏ hàng
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       description: Thông tin sản phẩm
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               productId:
     *                 type: string
     *               quantity:
     *                 type: number
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.post('/user/add-cart', UserController.addCart);

    /**
     * @swagger
     * /api/vnb/v1/user/checkout:
     *   post:
     *     summary: Thanh toán giỏ hàng
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       description: Thông tin thanh toán
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               paymentMethod:
     *                 type: string
     *               address:
     *                 type: string
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.post('/user/checkout', UserController.checkout);

    /**
     * @swagger
     * /api/vnb/v1/user/order:
     *   post:
     *     summary: Đặt hàng
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       description: Thông tin đặt hàng
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               productId:
     *                 type: string
     *               quantity:
     *                 type: number
     *               paymentMethod:
     *                 type: string
     *               address:
     *                 type: string
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.post('/user/order', UserController.order);

    /**
     * @swagger
     * /api/vnb/v1/user/update-order:
     *   put:
     *     summary: Cập nhật đơn hàng
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       description: Thông tin cập nhật đơn hàng
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               orderId:
     *                 type: string
     *               status:
     *                 type: string
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.put('/user/update-order', UserController.updateOrder);

    /**
     * @swagger
     * /api/vnb/v1/auth/send-otp:
     *   post:
     *     summary: Gửi mã OTP
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       description: Thông tin gửi mã OTP
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.post('/auth/send-otp', AuthController.sendOTP);

    /**
     * @swagger
     * /api/vnb/v1/auth/verify-account:
     *   post:
     *     summary: Xác minh tài khoản
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       description: Thông tin xác minh tài khoản
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               otp:
     *                 type: string
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.post('/auth/verify-account', AuthController.verifyAccount);

    /**
     * @swagger
     * /api/vnb/v1/auth/change-password:
     *   post:
     *     summary: Thay đổi mật khẩu
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       description: Thông tin thay đổi mật khẩu
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               oldPassword:
     *                 type: string
     *               newPassword:
     *                 type: string
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.post('/auth/change-password', AuthController.changePassword);

    /**
     * @swagger
     * /api/vnb/v1/auth/logout:
     *   post:
     *     summary: Đăng xuất
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.post('/auth/logout', AuthController.signOut);

    /**
     * @swagger
     * /api/vnb/v1/auth/refresh-token:
     *   post:
     *     summary: Lấy mã thông báo mới
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.post('/auth/refresh-token', AuthController.refreshToken);

    // Admin route

    /**
     * @swagger
     * /api/vnb/v1/admin/get-all-orders:
     *   get:
     *     summary: Lấy tất cả đơn hàng
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.get('/admin/get-all-orders', AdminController.getAllOrder);

    /**
     * @swagger
     * /api/vnb/v1/admin/get-statistical:
     *   get:
     *     summary: Lấy thông tin thống kê
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.get('/admin/get-statistical', AdminController.getStatistical);

    /**
     * @swagger
     * /api/vnb/v1/admin/update-order/{id}:
     *   patch:
     *     summary: Cập nhật đơn hàng
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID của đơn hàng
     *         schema:
     *           type: string
     *     requestBody:
     *       description: Thông tin cập nhật đơn hàng
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               status:
     *                 type: string
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.patch('/admin/update-order/:id', AdminController.updateOrder);

    /**
     * @swagger
     * /api/vnb/v1/admin/create-order:
     *   post:
     *     summary: Tạo đơn hàng
     *     tags: [Private]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       description: Thông tin tạo đơn hàng
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userId:
     *                 type: string
     *               productId:
     *                 type: string
     *               quantity:
     *                 type: number
     *               paymentMethod:
     *                 type: string
     *               address:
     *                 type: string
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.post('/admin/create-order', AdminController.createOrders);

    return app.use('/api/vnb/v1', router);
};

export default PrivateRoute;
