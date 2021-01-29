const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
	lastMessage: {
		body: {type: String, required: true}, 
		created: {type: Date, required: true}
	},
	members: [{ type: Types.ObjectId, ref: 'User' }],
	messages: [{ type: Types.ObjectId, ref: 'Message' }],
	created: {type: Date, required: true}
});

export default model('Channel', schema);