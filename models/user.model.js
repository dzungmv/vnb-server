import mongoose from 'mongoose';

const COLLECTION_NAME = 'Users';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
        role: {
            type: String,
            require: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
