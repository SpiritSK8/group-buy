import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './routes/users.js';
import auth from './routes/auth.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', users); // POST /users - register
app.use('/auth', auth);   // POST /auth - login

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.listen(3000, () => console.log('Server running on port 3000'));