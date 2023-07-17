import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import ProductController from '../controllers/product.controller.js';

const router = express.Router();
const PublicRoute = (app) => {
    /**
     * @swagger
     * tags:
     *   name: Public
     *   description: Các API công khai
     */

    /**
     * @swagger
     * /api/vnb/v1/product/get-products:
     *   get:
     *     summary: Lấy tất cả sản phẩm
     *     tags: [Public]
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.get('/product/get-products', ProductController.getAllProduct);

    /**
     * @swagger
     * /api/vnb/v1/product/get-product/{slug}:
     *   get:
     *     summary: Lấy thông tin sản phẩm theo slug
     *     tags: [Public]
     *     parameters:
     *       - in: path
     *         name: slug
     *         required: true
     *         description: Slug của sản phẩm
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.get('/product/get-product/:slug', ProductController.getProduct);

    /**
     * @swagger
     * /api/vnb/v1/product/search-products:
     *   post:
     *     summary: Tìm kiếm sản phẩm
     *     tags: [Public]
     *     requestBody:
     *       description: Thông tin tìm kiếm
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               keyword:
     *                 type: string
     *               category:
     *                 type: string
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.post('/product/search-products', ProductController.searchProduct);

    /**
     * @swagger
     * /api/vnb/v1/auth/register:
     *   post:
     *     summary: Đăng ký tài khoản
     *     tags: [Public]
     *     requestBody:
     *       description: Thông tin đăng ký
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.post('/auth/register', AuthController.signUp);

    /**
     * @swagger
     * /api/vnb/v1/auth/login:
     *   post:
     *     summary: Đăng nhập
     *     tags: [Public]
     *     requestBody:
     *       description: Thông tin đăng nhập
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.post('/auth/login', AuthController.signIn);

    /**
     * @swagger
     * /api/vnb/v1/auth/forgot-password:
     *   post:
     *     summary: Quên mật khẩu
     *     tags: [Public]
     *     requestBody:
     *       description: Thông tin quên mật khẩu
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
    router.post('/auth/forgot-password', AuthController.forgotPassword);

    /**
     * @swagger
     * /api/vnb/v1/auth/reset-password:
     *   post:
     *     summary: Đặt lại mật khẩu
     *     tags: [Public]
     *     requestBody:
     *       description: Thông tin đặt lại mật khẩu
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               token:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Thành công
     */
    router.post('/auth/reset-password', AuthController.resetPassword);

    /**
     * @swagger
     * /api/vnb/v1/auth/send-otp:
     *   post:
     *     summary: Gửi mã OTP
     *     tags: [Public]
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

    return app.use('/api/vnb/v1', router);
};

export default PublicRoute;
