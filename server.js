import express from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';

import AdminAPIRoute from './routes/routes.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

const DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@vnb-server.za0vtgf.mongodb.net/?retryWrites=true&w=majority`;

app.use(helmet());
// access cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization, x-client-id, x-refresh-token, _id'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

// middleware body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
AdminAPIRoute(app);

// start server
mongoose.set('strictQuery', false);
mongoose
    .connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to database!');
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    });
