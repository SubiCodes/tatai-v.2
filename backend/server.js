import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authAdminRouter from './routes/auth.admin.route.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        callback(null, origin); // Reflect the origin (allow all)
    },
    credentials: true
}));

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser());

app.use('/api/v1/authAdmin', authAdminRouter);

app.get('/', (req, res) => {
    res.send('Hello, World!!!');
});

app.listen(5000, () => {
    connectDB();
    console.log('Server is running on htttp://localhost:5000');
});
