const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
	channelId: {type: Types.ObjectId, required: true, ref: 'Channel'},
	body: {type: String, required: true},
	user: {
		name: {type: String, required: true},
		email: {type: String, required: true}
	}
});

export default model('Message', schema);