const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
	members: [{ type: Types.ObjectId, ref: 'User' }],
	messages: [{ type: Types.ObjectId, ref: 'Message' }]
});

export default model('Channel', schema);