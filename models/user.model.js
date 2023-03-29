import mongoose from 'mongoose';

const COLLECTION_NAME = 'Users';

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
