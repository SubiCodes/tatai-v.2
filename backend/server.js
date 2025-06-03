import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';

import authAdminRouter from './routes/auth.admin.route.js';
import userAdminRouter from './routes/user.admin.route.js';
import profileAdminRouter from './routes/profile.admin.route.js';
import guideAdminRouter from './routes/guide.admin.route.js';
dotenv.config();

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        callback(null, origin); 
    },
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use('/api/v1/authAdmin', authAdminRouter);
app.use('/api/v1/userAdmin', userAdminRouter);
app.use('/api/v1/profileAdmin', profileAdminRouter);
app.use('/api/v1/guideAdmin', guideAdminRouter);

app.get('/', (req, res) => {
    res.send('Hello, World!!!');
});

app.listen(5000, () => {
    connectDB();
    console.log('Server is running on htttp://localhost:5000');
});
