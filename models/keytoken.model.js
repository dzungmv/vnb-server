import mongoose from 'mongoose';

const COLLECTION_NAME = 'Keys';

const KeySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        publicKey: {
            type: String,
            required: true,
        },

        privateKey: {
            type: String,
            required: true,
        },

        refreshTokensUsed: {
            type: Array,
            default: [],
        },

        refreshToken: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const KeyModel = mongoose.model('Key', KeySchema);

export default KeyModel;
