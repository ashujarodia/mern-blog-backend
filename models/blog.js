import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	comments: [
		{
			content: String,
			author: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			createdAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export const Blog = mongoose.model('Blog', schema);
