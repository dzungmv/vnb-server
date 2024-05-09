import mongoose from 'mongoose';

const COLLECTION_NAME = 'OTP';

const OTPSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        otp: 
            type: String,
            required: true,
        },
        time: {
            type: Date,
            default: Date.now,
            index: { expires: '2m' },
        },
    },
    {
        collection: COLLECTION_NAME,
    }
);

const OTPModel = mongoose.model('OTP', OTPSchema);

export default OTPModel;
