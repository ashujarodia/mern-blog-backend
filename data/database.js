import mongoose from 'mongoose';

export const connectDB = () => {
	mongoose.connect(process.env.MONGO_URI, {
		dbName: 'blog-mern',
	})
		.then(() => console.log('Database connected'))
		.catch((error) => console.log(error));
};
