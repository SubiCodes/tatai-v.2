import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authAdminRouter from './routes/auth.admin.route.js';

dotenv.config();

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.use('/api/v1/authAdmin', authAdminRouter);

app.get('/', (req, res) => {
    res.send('Hello, World!!!');
});

app.listen(5000, () => {
    connectDB();
    console.log('Server is running on htttp://localhost:5000');
});
