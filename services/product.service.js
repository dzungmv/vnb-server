import ProductModel from '../models/product.model.js';

const getProductBySlug = async (slug) => {
    return await ProductModel.findOne({ slug: slug }).lean();
};

const findProductById = async (id) => {
    return await ProductModel.findById(id).lean();
};

const updateProductById = async (id, data) => {
    return await ProductModel.findByIdAndUpdate(id, {
        ...data,
    });
};

const deleteProductById = async (id) => {
    return await ProductModel.findByIdAndDelete(id);
};

export {
    findProductById,
    getProductBySlug,
    updateProductById,
    deleteProductById,
};
