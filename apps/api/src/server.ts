import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/auth';
import partyRouter from './routes/party';
import requestRouter from './routes/request';
import healthRouter from './routes/health';

const app = express();

const allowOrigins = (process.env.WEB_ORIGIN || 'http://localhost:5173')
  .split(',') // allow comma-separated list if needed
  .map(s => s.trim());

app.use(cors({ origin: allowOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/parties', partyRouter);
app.use('/requests', requestRouter);

app.use('/', healthRouter);


const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/parties';
const PORT = process.env.PORT || 4000;

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });
