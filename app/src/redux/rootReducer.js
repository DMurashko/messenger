import {ADD_CHANNEL, ADD_MESSAGE, SET_ACTIVE_CHANNEL_ID, ORDER_CHANNELS, UPDATE_LAST_MESSAGE, ORDER_CHANNELS_BY_THE_LATEST_MESSAGE, DISPLAY_SEARCH_BAR, HIDE_SEARCH_BAR, SET_SEARCH_RESULTS, ADD_USER_TO_CHANNEL, REMOVE_USER_FROM_CHANNEL, DELETE_CHANNEL, LOGIN, DISPLAY_USER_FORM, HIDE_USER_FORM } from './types';
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

	isSearchBarRequired: false,

	isUserFormRequired: false,

	currentUser: null,//{
	// 	_id: 2,
	// 	name: 'Dimati',
	// 	email: 'dimati@gmail.com',
	// 	created: new Date(),
	// },

	members: [
		{
			_id: 0,
			name: 'Toan',
			email: 'toan@gmail.com',
			created: new Date(),
		},
		{
			_id: 1,
			name: 'Siegfried',
			email: 'siegfried@gmail.com',
			created: new Date(),
		},
		{
			_id: 2,
			name: 'Dimati',
			email: 'dimati@gmail.com',
			created: new Date(),
		}
	],

	searchResults: [],
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
				return { ...channel, lastMessage: action.payload.lastMessage }
			});
			return { ...state, channels: newChannels };
		case ORDER_CHANNELS_BY_THE_LATEST_MESSAGE:
			return { ...state, channels: state.channels.sort((first, second) => second.lastMessage.created - first.lastMessage.created) };
		case DISPLAY_SEARCH_BAR:
			return { ...state, isSearchBarRequired: true };
		case HIDE_SEARCH_BAR:
			return { ...state, isSearchBarRequired: false };
		case SET_SEARCH_RESULTS:
			return { ...state, searchResults: action.payload };
		case ADD_USER_TO_CHANNEL:
			if (state.channels[action.payload.channelIndex].members.some(item => item === action.payload.userId))
				return state;
			const channelsWithNewUser = updateItemInArray(state.channels, action.payload.channelIndex, channel => {
				return { ...channel, members: channel.members.concat([action.payload.userId]) }
			});
			return { ...state, channels: channelsWithNewUser };
		case REMOVE_USER_FROM_CHANNEL:
			if (!state.channels[action.payload.channelIndex].members.some(item => item === action.payload.userId))
				return state;
			const channelsWithoutNewUser = updateItemInArray(state.channels, action.payload.channelIndex, channel => {
				return { ...channel, members: channel.members.splice(channel.members.findIndex(item => item === action.payload.userId), 1) }
			});
			return { ...state, channels: channelsWithoutNewUser };
		case DELETE_CHANNEL:
			return { ...state, channels: state.channels.splice(state.channels.findIndex(item => item === action.payload), 1) };
		case LOGIN:
			return { ...state, currentUser: action.payload };
		case DISPLAY_USER_FORM:
			return { ...state, isUserFormRequired: true };
		case HIDE_USER_FORM:
			return { ...state, isUserFormRequired: false };
		default: return state
	}
}

export default rootReducer;