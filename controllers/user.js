import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { sendCookie } from '../utils/features.js';

export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).select('+password');
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'Invalid email or password',
			});
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(404).json({
				success: false,
				message: 'Invalid email or password',
			});
		}
		sendCookie(user, res, `Welcome Back , ${user.name}`, 200);
	} catch (error) {
		next(error);
	}
};

export const registerUser = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;
		let user = await User.findOne({ email });
		if (user) {
			return res.status(404).json({
				success: false,
				message: 'User already exists',
			});
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		user = await User.create({ name, email, password: hashedPassword });
		sendCookie(user, res, 'Register Successfully', 201);
	} catch (error) {
		next(error);
	}
};

export const getMyProfile = (req, res) => {
	res.status(200).json({
		success: true,
		user: req.user,
	});
};

export const logout = (req, res) => {
	res.status(200)
		.cookie('token', '', {
			expires: new Date(Date.now()),
			sameSite: process.env.NODE_ENV === 'Development' ? 'lax' : 'none',
			secure: process.env.NODE_ENV === 'Development' ? false : true,
		})
		.json({
			success: true,
			message: 'logout success',
		});
};

export const getUserProfie = async (req, res, next) => {
	try {
		const { id } = req.params;
		let user = await User.findById(id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User does not exists',
			});
		}
		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		next(error);
	}
};
