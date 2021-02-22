const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
	channelId: {type: Types.ObjectId, required: true, ref: 'Channel'},
	body: {type: String, required: true},
	userId: {type: Types.ObjectId, required: true, ref: 'User' }
});

export default model('Message', schema);