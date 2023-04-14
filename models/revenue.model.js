import mongoose from 'mongoose';

const COLLECTION_NAME = 'Revenue';

const RevenueSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
            default: 0,
        },
        date: {
            type: Date,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const RevenueModel = mongoose.model('Revenue', RevenueSchema);

export default RevenueModel;
