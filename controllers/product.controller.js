import ProductModel from '../models/product.model.js';
import {
    deleteProductById,
    getProductBySlug,
    updateProductById,
} from '../services/product.service.js';

let SORT_BY = {
    PRICE_ASC: {
        price: 1,
    },
    PRICE_DESC: {
        price: -1,
    },
    NAME_ASC: {
        name: 1,
    },
    NAME_DESC: {
        name: -1,
    },
    UPDATED_AT_ASC: {
        updatedAt: 1,
    },
    UPDATED_AT_DESC: {
        updatedAt: -1,
    },
};

const SORT_TYPE = {
    PRICE_ASC: 'price_asc',
    PRICE_DESC: 'price_desc',
    NAME_ASC: 'name_asc',
    NAME_DESC: 'name_desc',
    UPDATED_AT_ASC: 'updated_at_asc',
    UPDATED_AT_DESC: 'updated_at_desc',
};

const PRICE_TYPE = {
    ALL: 'all',
    LESS_THAN_500: 'less_than_500',
    BETWEEN_500_1000: 'between_500_1000',
    BETWEEN_1000_2000: 'between_1000_2000',
    BETWEEN_2000_3000: 'between_2000_3000',
    GREATER_THAN_3000: 'greater_than_3000',
};

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
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 10;
    const sort =
        req.query.sort && req.query.sort.length > 0
            ? req.query.sort
            : SORT_BY.UPDATED_AT_DESC;
    const price = req.query.price;
    let brand =
        req.query.brand && req.query.brand.length > 0 ? req.query.brand : 'all';
    let stores =
        req.query.stores && req.query.stores.length > 0
            ? req.query.stores
            : 'all';

    console.log('Request Query: ', req.query);

    try {
        if (page) {
            const skip = (page - 1) * limit;

            let sortBy = sort;
            let query = {};
            let filterByPrice = {};

            const brandOptions = [
                'VNB',
                'Yonex',
                'Lining',
                'Kawasaki',
                'Adidas',
            ];

            const storeOptions = [
                'VNB 1 District',
                'VNB 2 District',
                'VNB 3 District',
                'VNB 4 District',
                'VNB 5 District',
                'VNB 6 District',
                'VNB 7 District',
                'VNB 8 District',
                'VNB 9 District',
                'VNB 10 District',
                'VNB 11 District',
                'VNB 12 District',
            ];

            stores === 'all'
                ? (stores = [...storeOptions])
                : (stores = req.query.stores.split(','));

            brand === 'all'
                ? (brand = [...brandOptions])
                : (brand = req.query.brand.split(','));

            // filter by brand

            if (price === PRICE_TYPE.LESS_THAN_500) {
                filterByPrice = { $lt: 500000 };
                query = { price: filterByPrice };
            }

            if (price === PRICE_TYPE.BETWEEN_500_1000) {
                filterByPrice = { $gte: 500000, $lte: 1000000 };
                query = { price: filterByPrice };
            }

            if (price === PRICE_TYPE.BETWEEN_1000_2000) {
                filterByPrice = { $gte: 1000000, $lte: 2000000 };
                query = { price: filterByPrice };
            }

            if (price === PRICE_TYPE.BETWEEN_2000_3000) {
                filterByPrice = { $gte: 2000000, $lte: 3000000 };
                query = { price: filterByPrice };
            }

            if (price === PRICE_TYPE.GREATER_THAN_3000) {
                filterByPrice = { $gt: 3000000 };
                query = { price: filterByPrice };
            }

            if (sort === SORT_TYPE.PRICE_ASC) {
                sortBy = SORT_BY.PRICE_ASC;
            }
            if (sort === SORT_TYPE.PRICE_DESC) {
                sortBy = SORT_BY.PRICE_DESC;
            }
            if (sort === SORT_TYPE.NAME_ASC) {
                sortBy = SORT_BY.NAME_ASC;
            }
            if (sort === SORT_TYPE.NAME_DESC) {
                sortBy = SORT_BY.NAME_DESC;
            }
            if (sort === SORT_TYPE.UPDATED_AT_ASC) {
                sortBy = SORT_BY.UPDATED_AT_ASC;
            }

            const products = await ProductModel.find(query)
                .lean()
                .where('stores')
                .in([...stores])
                .where('brand')
                .in([...brand])
                .skip(skip)
                .limit(limit)
                .sort(sortBy);

            return res.status(200).json({
                status: true,
                message: 'Get products successfully!',
                data: products,
            });
        }

        const products = await ProductModel.find({}).lean();

        if (products) {
            return res.status(200).json({
                status: true,
                message: 'Get products successfully!',
                data: products,
            });
        }

        return res.status(404).json({
            status: false,
            message: 'Products not found!',
        });
    } catch (error) {
        console.error(error);
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
