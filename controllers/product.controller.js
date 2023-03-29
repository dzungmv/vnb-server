import ProductModel from '../models/product.model.js';

const addProduct = async (req, res) => {
    console.log(req.body);
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

export default { addProduct };
