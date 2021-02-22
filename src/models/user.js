const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	channels: [{ type: Types.ObjectId, ref: 'Channel' }]
});

export default model('User', schema);