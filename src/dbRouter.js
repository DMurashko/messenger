import User from './models/user';
import { Router } from "express";
import Channel from './models/channelModel';
import Message from './models/messageModel';
import auth from '../middleware/authMiddleware';
import { createMessage } from './dbQueries';
const mongoose = require('mongoose');

export const dbRouter = Router();

dbRouter.get('/:userId/channels/', auth,
	async (req, res, next) => {
		try {
			const userId = req.params.userId;
			const retrievedChannels = await Channel.find({'members': mongoose.Types.ObjectId(userId) });
			
			if (!retrievedChannels.length) {
				return res.status(404).json({message: 'No channels are found'});
			}

			res.status(200).json({ channels: retrievedChannels });
		} catch (e) { 
			console.log(e);
			res.status(500).json({message: 'Something went wrong, try again later!'});
		}
	}
);

dbRouter.post('/channel/',
	async (req, res, next) => {
		try {
			const {userId} = req.body;
			const newChannel = new Channel({ members: [userId], messages: [] });
			
			await newChannel.save(function(err, doc) {
				if (err) {
					return res.status(400).json({message: 'Channels can\'t be saved'});
				};
				console.log("Document inserted succussfully!");
				res.status(201).json({ channels: 'New channel is created' });
			});
		} catch (e) {
			res.status(500).json({message: 'Something went wrong, try again later!'});
		}
	}
);

dbRouter.get('/:userId/messages/', auth,
	async (req, res, next) => {
		try {
			const userId = req.params.userId;
			const retrievedMessages = await Message.find({'userId': mongoose.Types.ObjectId(userId) });
			
			if (!retrievedMessages) {
				return res.status(404).json({message: 'No channels are found'});
			}

			res.status(200).json({ messages: retrievedMessages });
		} catch (e) { 
			console.log(e);
			res.status(500).json({message: 'Something went wrong, try again later!'});
		}
	}
);

dbRouter.post('/message/',
	async (req, res, next) => {
		try {
			const {userId, message, channelId} = req.body;
			createMessage({userId, message, channelId, cb(err, doc) {
				if (err) { 
					console.log(err);
					return res.status(400).json({message: 'Messages can\'t be saved'});
				}
				console.log("Document inserted succussfully!");
				res.status(201).json({ message: 'New message is created' });
			}});
		} catch (e) {
			res.status(500).json({message: 'Something went wrong, try again later!'});
		}
	}
);

dbRouter.get('/message/:messageId/', auth,
	async (req, res, next) => {
		try {
			const messageId = req.params.messageId;
			const retrievedMessage = await Message.findById(mongoose.Types.ObjectId(messageId));
			
			if (!retrievedMessage) {
				return res.status(404).json({message: 'The message is not found'});
			}

			res.status(200).json({ message: retrievedMessage });
		} catch (e) { 
			console.log(e);
			res.status(500).json({message: 'Something went wrong, try again later!'});
		}
	}
);

dbRouter.get('/:userId/user/', auth,
	async (req, res, next) => {
		try {
			const userId = req.params.userId;
			const retrievedUser = await User.findById(mongoose.Types.ObjectId(userId)).select('channels email name');
			
			if (!retrievedUser) {
				return res.status(404).json({message: 'The user is not found'});
			}

			res.status(200).json({ user: retrievedUser });
		} catch (e) { 
			console.log(e);
			res.status(500).json({message: 'Something went wrong, try again later!'});
		}
	}
);

dbRouter.get('/users/', auth,
	async (req, res, next) => {
		try {
			const retrievedUsers = await User.find({}).select('channels email name');
			
			if (!retrievedUsers) {
				return res.status(404).json({message: 'The users are not found'});
			}

			res.status(200).json({ users: retrievedUsers });
		} catch (e) { 
			console.log(e);
			res.status(500).json({message: 'Something went wrong, try again later!'});
		}
	}
);