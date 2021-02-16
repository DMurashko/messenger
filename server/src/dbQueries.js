import Channel from './models/channelModel';
import Message from './models/messageModel';
const mongoose = require('mongoose');

export async function createMessage({ userId, message, channelId, _id, cb }) {
	if (_id) {
		const newMessage = new Message({ 
			_id: _id,
			channelId: channelId,
			body: message,
			userId: userId,
		});

		await newMessage.save(cb);
	} else {
		const newMessage = new Message({ 
			channelId: channelId,
			body: message,
			userId: userId,
		});

		await newMessage.save(cb);
	}
}

export async function addMessageToChannel({ messageId, channelId }) {
	if (channelId && messageId) {
		try {
			Channel.updateOne({_id: mongoose.Types.ObjectId(channelId)}, {
				$push: {
					messages: messageId
				}
			}, (err, doc) => {
				if (err)
					console.log(err);
				if (doc)
					console.log(doc);
			});
		} catch(e) {
			console.log(e);
		}
	} else {
		throw new Error('Ids are not defined');
	}
}