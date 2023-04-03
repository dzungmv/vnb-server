import ProductModel from '../models/product.model.js';
import {
    deleteProductById,
    findProductById,
    getProductBySlug,
    updateProductById,
} from '../services/product.service.js';

const addProduct = async (req, res) => {
    try {
        const newProduct = await ProductModel.create({
            ...req.body,
        });

        if (newProduct) {
            return res.status(201).json({
                message: 'Add product successfully!',
                data: newProduct,
            });
        }

        return res.status(400).json({
            message: 'Add product failed!',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server!',
            error: error,
        });
    }
};

const getAllProduct = async (req, res) => {
    try {
        const products = await ProductModel.find({}).lean();

        if (products) {
            return res.status(200).json({
                message: 'Get products successfully!',
                data: products,
            });
        }

        return res.status(400).json({
            message: 'Get products failed!',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server!',
            error: error,
        });
    }
};

const getProduct = async (req, res) => {
    const { slug } = req.params;
    try {
        const findProduct = await getProductBySlug(slug);

        if (!findProduct) {
            return res.status(404).json({
                status: false,
                message: 'Product not found!',
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Get product successfully!',
            data: findProduct,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server!',
            error: error,
        });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const updateProduct = await updateProductById(id, req.body);

        if (!updateProduct) {
            return res.status(404).json({
                message: 'Product not found!',
            });
        }

        return res.status(200).json({
            message: 'Update product successfully!',
            data: updateProduct,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Update product failed!',
        });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteSong = await deleteProductById(id);

        if (!deleteSong) {
            return res.status(404).json({
                message: 'Product not found!',
            });
        }

        return res.status(200).json({
            message: 'Delete product successfully!',
            data: deleteSong,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Delete product faild!',
        });
    }
};

export default {
    addProduct,
    getAllProduct,
    getProduct,
    updateProduct,
    deleteProduct,
};
