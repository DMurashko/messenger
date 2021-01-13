import {ADD_CHANNEL, ADD_MESSAGE, SET_ACTIVE_CHANNEL_ID, ORDER_CHANNELS, UPDATE_LAST_MESSAGE, ORDER_CHANNELS_BY_THE_LATEST_MESSAGE} from './types';
import avatar from '../images/avatar.jpeg';

function updateItemInArray(array, itemId, updateItemCallback) {
	
	const updatedItems = array.map((item, index) => {
	  if (index !== itemId) {
		// Since we only want to update one item, preserve all others as they are now
		return item;
	  }
  
	  // Use the provided callback to create an updated item
	  const updatedItem = updateItemCallback(item);
	  return updatedItem;
	})
	
	return updatedItems;
}

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
			lastMessage: {
				body: `Last message`,
				created: (new Date()).getTime()
			},
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
			return { ...state, channels: state.channels.sort((first, second) => second.created.getTime() - first.created.getTime()) };
		case UPDATE_LAST_MESSAGE:
			const newChannels = updateItemInArray(state.channels, action.payload.channelIndex, channel => {
				return { ...channel, lastMessage: action.payload.lastMessage}
			});
			return { ...state, channels: newChannels };
		case ORDER_CHANNELS_BY_THE_LATEST_MESSAGE:
			return { ...state, channels: state.channels.sort((first, second) => second.lastMessage.created - first.lastMessage.created) };
		default: return state
	}
}

export default rootReducer;