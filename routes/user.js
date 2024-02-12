import express from 'express';
import { getMyProfile, getUserProfie, login, logout, registerUser } from '../controllers/user.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/me', isAuthenticated, getMyProfile);
router.get('/logout', isAuthenticated, logout);
router.get('/getUserProfile/:id', isAuthenticated, getUserProfie);

export default router;
