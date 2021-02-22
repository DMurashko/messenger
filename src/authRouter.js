import { Router } from "express";
import bcrypt from 'bcrypt';
const { check, validationResult } = require('express-validator');
import User from '../src/models/user';
import jwt from 'jsonwebtoken';
import config from 'config';

export const START_TIME = new Date();

export const AuthRouter = Router();

// /api/auth/register
AuthRouter.post('/register', [
		check('email', 'Invalid email').isEmail(),
		check('password', 'Minlength is 6 characters').isLength({ min: 6 })
	], 
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
			console.log(req.body);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Invalid data provided'
				});
			}

			const {email, password, name} = req.body;

			const candidate = await User.findOne({ email });

			if (candidate) {
				res.status(400).json({message: 'The user already exists'});
			}

			const hashedPassword = await bcrypt.hash(password, 12);
			const user = new User({ email, password: hashedPassword, name });

			await user.save();

			res.status(201).json({ message: 'The user is created' });
		} catch (e) {
			res.status(500).json({message: 'Something went wrong, try again later!'});
		}
	}
);

// /api/auth/login
AuthRouter.post('/login', [
		check('email', 'Enter correct email').normalizeEmail().isEmail(),
		check('password', 'Enter the password').exists()
	],
	async (req, res, next) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Invalid data provided while entering the system'
				});
			}

			const {email, password} = req.body;

			const user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({message: 'The user is not found'});
			}

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({ message: 'Invalid password, please, try again' });
			}

			const token = jwt.sign(
				{ userId: user._id },
				config.get('jwtSecret'),
				{ expiresIn: '1h' }
			);

			res.json({ token, userId: user._id, name: user.name, email });

		} catch (e) {
			res.status(500).json({message: 'Something went wrong, try again later!'});
		}
	}
);