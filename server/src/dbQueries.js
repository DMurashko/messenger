import Message from './models/messageModel';
const mongoose = require('mongoose');

export async function createMessage({ userId, message, channelId, cb }) {
	const newMessage = new Message({ 
		channelId: channelId,
		body: message,
		userId: userId
	});
	await newMessage.save(cb);
}