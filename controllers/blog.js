import { Blog } from '../models/blog.js';

export const newBlog = async (req, res, next) => {
	try {
		const { title, content } = req.body;
		if (!title || !content) {
			res.status(400).json({
				success: false,
				message: 'Provide all fields',
			});
		}
		const blog = await Blog.create({ title, content, user: req.user });
		res.status(200).json({
			success: true,
			message: 'Blog created successfully',
		});
	} catch (error) {
		next(error);
	}
};

export const getAllBlogs = async (req, res, next) => {
	try {
		const blogs = await Blog.find({});
		if (!blogs) {
			return res.status(200).json({
				success: false,
				message: 'No Blogs Found',
			});
		}
		return res.status(200).json({
			success: true,
			blogCount: blogs.length,
			message: 'All blogs lists',
			blogs,
		});
	} catch (error) {
		next(error);
	}
};

export const getMyBlogs = async (req, res, next) => {
	try {
		const { _id } = req.user;
		const blogs = await Blog.find({ user: _id });
		if (!blogs) {
			return res.status(404).json({
				success: false,
				message: 'Blog not Found',
			});
		}
		return res.status(200).json({
			success: true,
			message: 'Blogs fetched',
			blogs,
		});
	} catch (error) {
		next(error);
	}
};
export const updateBlog = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, content } = req.body;
		const updatedBlog = await Blog.findByIdAndUpdate(id, { title, content }, { new: true });
		return res.status(200).json({
			success: true,
			message: 'Blog updated successfully',
			updatedBlog,
		});
	} catch (error) {
		next(error);
	}
};
export const deleteBlog = async (req, res, next) => {
	try {
		const { _id } = req.user;
		const { id } = req.params;
		const blog = await Blog.findById(id);

		if (!blog) {
			return res.status(404).json({
				success: false,
				message: 'Blog not found',
			});
		}
		if (blog.user.toString() !== _id.toString()) {
			return res.status(403).json({
				success: false,
				message: 'Not authorized',
			});
		}
		await blog.deleteOne();
		return res.status(200).json({
			success: true,
			message: 'Blog deleted',
		});
	} catch (error) {
		next(error);
	}
};

export const likeBlog = async (req, res, next) => {
	try {
		const blog = await Blog.findById(req.params.blogId);
		const { _id } = req.user;

		if (!blog) {
			return res.status(404).json({ message: 'Blog not found' });
		}
		//Check if blog is already liked by user
		const isLiked = blog.likes.includes(_id);

		if (isLiked) {
			//User already liked the post , remove the like
			blog.likes = blog.likes.filter((id) => id.toString() !== _id.toString());

			await blog.save();
			res.status(200).json({
				success: true,
				message: 'Like removed',
				blog,
			});
		} else {
			blog.likes.push(_id);

			await blog.save();
			res.status(200).json({
				success: true,
				message: 'Blog liked',
				blog,
			});
		}
	} catch (error) {
		next(error);
	}
};

export const addComment = async (req, res, next) => {
	try {
		const { content } = req.body;

		const { _id } = req.user;

		const blog = await Blog.findById(req.params.blogId);
		if (!blog) {
			return res.status(404).json({ message: 'Blog not found' });
		}
		if (!content) {
			return res.status(404).json({ message: 'Please add comment first' });
		}

		blog.comments.push({ content, author: _id });
		await blog.save();
		res.status(200).json({
			success: true,
			message: 'Comment added successfully',
			blog,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteComment = async (req, res, next) => {
	try {
		const { blogId, commentId } = req.params;
		const blog = await Blog.findById(req.params.blogId);
		if (!blog) {
			return res.status(404).json({ message: 'Blog not found' });
		}
		const commentIndex = blog.comments.findIndex((comment) => comment._id.toString() === commentId);

		//check if the comment exists
		if (commentIndex === -1) {
			return res.status(404).json({ message: 'Comment not found' });
		}

		//check if the user is the author of the commnet
		if (blog.comments[commentIndex].author.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: 'You are not authorized to delete this comment' });
		}

		//remove the comment from the comments array
		blog.comments.splice(commentIndex, 1);
		await blog.save();
		res.status(200).json({
			success: true,
			message: 'Comment deleted successfully',
			blog,
		});
	} catch (error) {
		next(error);
	}
};

export const getUserBlogs = async (req, res, next) => {
	try {
		const { id } = req.params;
		const blogs = await Blog.find({ user: id });
		return res.status(200).json({
			success: true,
			blogs,
		});
	} catch (error) {
		next(error);
	}
};
