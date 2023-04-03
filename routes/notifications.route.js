import express from 'express';
import { Server } from 'socket.io';

const NotificationSoketIO = (app) => {
    const router = express.Router();

    router.get('/notifications', (req, res) => {
        res.send('Hello World');
    });

    return app.use('/api/vnb/v1', router);
};
