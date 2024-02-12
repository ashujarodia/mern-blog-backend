import express from 'express';
import userRouter from './routes/user.js';
import blogRouter from './routes/blog.js';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.js';
import cors from 'cors';

export const app = express();

config({
	path: './data/config.env',
});

//using middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	})
);

//routes
app.use('/users', userRouter);
app.use('/blogs', blogRouter);

app.get('/', (req, res) => {
	res.send('working');
});

//using error middleware
app.use(errorMiddleware);
