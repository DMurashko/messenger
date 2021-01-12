import {ADD_CHANNEL, ADD_MESSAGE, SET_ACTIVE_CHANNEL_ID, ORDER_CHANNELS} from './types';
import avatar from '../images/avatar.jpeg';

const initialState = {
	messages: [
		{
			_id: 0,
			channelId: 0,
			user: {
				_id: 0,
				name: 'Toan',
				created: new Date(),
			},
			body: 'I love React',
			avatar: avatar,
			me: true
		},
		{
			_id: 1,
			channelId: 0,
			user: {
				_id: 1,
				name: 'Siegfried',
				created: new Date(),
			},
			body: 'I love JS',
			avatar: avatar,
			me: false
		}
	],
	
	channels: [
		{
			_id: 0,
			title: `The fisrt`,
			lastMessage: `Last message`,
			members: [0, 1],
			messages: [0, 1, 8, 10],
			created: new Date()
		}
	],

	activeChannelId: 0,

	currentUser: {
		_id: 2,
		name: 'Dimati',
		created: new Date(),
	},

	members: [
		{
			_id: 0,
			name: 'Toan',
			created: new Date(),
		},
		{
			_id: 1,
			name: 'Siegfried',
			created: new Date(),
		},
		{
			_id: 2,
			name: 'Dimati',
			created: new Date(),
		}
	]
}

// Pure Functions
const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_MESSAGE:
			return { ...state, messages: state.messages.concat([action.payload]) };
		case ADD_CHANNEL:
			return { ...state, channels: state.channels.concat([action.payload]) };
		case SET_ACTIVE_CHANNEL_ID:
			return { ...state, activeChannelId: action.payload };
		case ORDER_CHANNELS:
			return { ...state, channels: state.channels.sort((first, second) => first.created.getSeconds - second.created.getSeconds) };
		default: return state
	}
}

export default rootReducer;