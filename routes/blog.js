import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { addComment, deleteBlog, deleteComment, getAllBlogs, getMyBlogs, likeBlog, newBlog, updateBlog } from '../controllers/blog.js';

const router = express.Router();

router.post('/newBlog', isAuthenticated, newBlog);
router.get('/getAllBlogs', isAuthenticated, getAllBlogs);
router.put('/updateBlog/:id', isAuthenticated, updateBlog);
router.delete('/deleteBlog/:id', isAuthenticated, deleteBlog);
router.get('/getMyBlogs', isAuthenticated, getMyBlogs);
router.post('/likeBlog/:blogId', isAuthenticated, likeBlog);
router.post('/addComment/:blogId', isAuthenticated, addComment);
router.delete('/deleteComment/:blogId/:commentId', isAuthenticated, deleteComment);

export default router;
