import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { connectDB } from './config/db.js';

import authAdminRouter from './routes/auth.admin.route.js';
import userAdminRouter from './routes/user.admin.route.js';
import profileAdminRouter from './routes/profile.admin.route.js';
import guideAdminRouter from './routes/guide.admin.route.js';
import viewUserAdminRouter from './routes/viewUser.admin.route.js';

import feedbackRouter from './routes/feedback.route.js';
import reportRouter from './routes/report.route.js';
import chatbotRouter from './routes/chatbot.route.js';
import notificationRouter from './routes/notification.route.js';

import authUserRouter from './routes/auth.user.route.js';
import userUserRouter from './routes/user.user.route.js';
import emailUserRouter from './routes/email.user.route.js';
import guideUserRouter from './routes/guide.user.route.js';
import searchUserRouter from './routes/search.user.route.js';
import bookmarkUserRouter from './routes/bookmark.route.js';
import dashboardRouter from './routes/dashboard.admin.route.js';
import mobileVersionRouter from './routes/mobile_version.route.js';
import conversationRouter from './routes/conversation.route.js';

import { File } from "node:buffer";
import { verifyAdmin } from './middleware/verifyAdmin.middleware.js';

if (!globalThis.File) {
  globalThis.File = File;
}

dotenv.config();

const app = express();
app.use(fileUpload());

app.use(cors({
    origin: [
        'http://localhost:5173', // Local development
        'http://localhost:3000', // Local development
        'https://tatai-admin.vercel.app', // Your production frontend
        'https://tatai-admin-i3wlbehxn-rein-subisols-projects.vercel.app' // Preview URLs
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

//admin routers
app.use('/api/v1/authAdmin', authAdminRouter);
app.use('/api/v1/userAdmin', verifyAdmin, userAdminRouter);
app.use('/api/v1/viewUserAdmin', verifyAdmin, viewUserAdminRouter);
app.use('/api/v1/profileAdmin', verifyAdmin, profileAdminRouter);
app.use('/api/v1/guideAdmin', verifyAdmin, guideAdminRouter);
app.use('/api/v1/dashboardAdmin', verifyAdmin, dashboardRouter);

//Both Users
app.use('/api/v1/feedback', feedbackRouter);
app.use('/api/v1/report', reportRouter);
app.use('/api/v1/chatbot', chatbotRouter);
app.use('/api/v1/notification', notificationRouter);

//user/mobile routers
app.use('/api/v1/authUser', authUserRouter);
app.use('/api/v1/userUser', userUserRouter);
app.use('/api/v1/emailUser', emailUserRouter);
app.use('/api/v1/guideUser', guideUserRouter);
app.use('/api/v1/searchUser', searchUserRouter);
app.use('/api/v1/bookmarkUser', bookmarkUserRouter);
app.use('/api/v1/mobileVersion', mobileVersionRouter);
app.use('/api/v1/conversation', conversationRouter);

app.get('/', (req, res) => {
    res.send('Hello, World!!!');
});

app.listen(3000, () => {
    connectDB();
    console.log('Server is running on htttp://localhost:3000');
});
