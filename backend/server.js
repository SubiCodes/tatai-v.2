import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';

import authAdminRouter from './routes/auth.admin.route.js';
import userAdminRouter from './routes/user.admin.route.js';
import profileAdminRouter from './routes/profile.admin.route.js';
import guideAdminRouter from './routes/guide.admin.route.js';

import authUserRouter from './routes/auth.user.route.js';
import userUserRouter from './routes/user.user.route.js';
import emailUserRouter from './routes/email.user.route.js';
import guideUserRouter from './routes/guide.user.route.js';
import feedbackRouter from './routes/feedback.route.js';
import searchUserRouter from './routes/search.user.route.js';

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

//admin routers
app.use('/api/v1/authAdmin', authAdminRouter);
app.use('/api/v1/userAdmin', userAdminRouter);
app.use('/api/v1/profileAdmin', profileAdminRouter);
app.use('/api/v1/guideAdmin', guideAdminRouter);

//Both Users
app.use('/api/v1/feedback', feedbackRouter);

//user/mobile routers
app.use('/api/v1/authUser', authUserRouter);
app.use('/api/v1/userUser', userUserRouter);
app.use('/api/v1/emailUser', emailUserRouter);
app.use('/api/v1/guideUser', guideUserRouter);
app.use('/api/v1/searchUser', searchUserRouter);

app.get('/', (req, res) => {
    res.send('Hello, World!!!');
});

app.listen(3000, () => {
    connectDB();
    console.log('Server is running on htttp://localhost:3000');
});
