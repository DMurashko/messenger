import {
	ADD_CHANNEL, 
	ADD_MESSAGE, 
	SET_ACTIVE_CHANNEL_ID, 
	ORDER_CHANNELS, 
	UPDATE_LAST_MESSAGE, 
	ORDER_CHANNELS_BY_THE_LATEST_MESSAGE, 
	DISPLAY_SEARCH_BAR, 
	HIDE_SEARCH_BAR, 
	SET_SEARCH_RESULTS, 
	ADD_USER_TO_CHANNEL, 
	REMOVE_USER_FROM_CHANNEL, 
	DELETE_CHANNEL, 
	LOGIN, 
	DISPLAY_USER_FORM, 
	HIDE_USER_FORM, 
	DISPLAY_USER_MENU, 
	HIDE_USER_MENU, 
	ADD_USER_TO_MEMBERS,
	FETCH_STATUS,
	REQUEST_SIGN_IN_SUCCESS,
	SET_LAST_MESSAGE,
	SEND_NEW_CHANNEL,
	ADD_MESSAGE_TO_CHANNEL,
	CLEAR_CACHE_DATA,
	DISPLAY_REGISTER_FORM,
	HIDE_REGISTER_FORM
} from './types';
import {ObjectId} from '../helpers/objectid';

function updateItemInArray(array, itemId, updateItemCallback) {
	
	const updatedItems = array.map((item, index) => {
		if (index !== itemId) {
			// Since we only want to update one item, preserve all others as they are now
			return item;
		}
	
		// Use the provided callback to create an updated item
		const updatedItem = updateItemCallback(item);
		return updatedItem;
	});
	
	return updatedItems;
}

function updateItemInArrayById(array, itemId, updateItemCallback) {
	
	const updatedItems = array.map((item) => {
		if (item._id !== itemId) {
			// Since we only want to update one item, preserve all others as they are now
			return item;
		}
	
		// Use the provided callback to create an updated item
		const updatedItem = updateItemCallback(item);
		return updatedItem;
	});
	
	return updatedItems;
}

function getTimeFromObjectId(obj) {
	return ObjectId(obj._id).getTimestamp().getTime();
}

const initialState = {
	messages: [],
	
	channels: [],

	activeChannelId: 0,

	isSearchBarRequired: false,

	isUserFormRequired: false,

	isUserMenuRequired: false,

	isRegisterFormRequired: false,

	currentUser: null,

	members: [],

	searchResults: [],

	fetchStatus: false,

	signinSuccess: false,

	creatingNewChannel: false
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
			return { ...state, channels: state.channels.sort((first, second) => getTimeFromObjectId(second) - getTimeFromObjectId(first)) };
		case UPDATE_LAST_MESSAGE:
			const newChannels = updateItemInArray(state.channels, action.payload.channelIndex, channel => {
				return { ...channel, lastMessage: action.payload.lastMessage }
			});
			return { ...state, channels: newChannels };
		case ORDER_CHANNELS_BY_THE_LATEST_MESSAGE:
			return { ...state, channels: state.channels.sort((first, second) => getTimeFromObjectId(second.lastMessage)- getTimeFromObjectId(first.lastMessage)) };
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
		case ADD_MESSAGE_TO_CHANNEL:
			if (state.channels.find(channel => channel._id === action.payload.channelId).messages.some(item => item === action.payload._id))
				return state;
			const channelsWithNewMessage = updateItemInArrayById(state.channels, action.payload.channelId, channel => {
				return { ...channel, messages: channel.messages.concat([action.payload._id]) }
			});
			return { ...state, channels: channelsWithNewMessage };
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
		case DISPLAY_REGISTER_FORM:
			return { ...state, isRegisterFormRequired: true };
		case HIDE_REGISTER_FORM:
			return { ...state, isRegisterFormRequired: false };
		case DISPLAY_USER_MENU:
			return { ...state, isUserMenuRequired: true };
		case HIDE_USER_MENU:
			return { ...state, isUserMenuRequired: false };
		case ADD_USER_TO_MEMBERS:
			return { ...state, members: state.members.concat([action.payload]) };
		case FETCH_STATUS:
			return { ...state, fetchStatus: action.payload };
		case REQUEST_SIGN_IN_SUCCESS:
			return { ...state, signinSuccess: action.payload };
		case SET_LAST_MESSAGE:
			const channelsWithLastMessage = updateItemInArrayById(state.channels, action.payload.channelId, channel => {
				return { ...channel, lastMessage: action.payload.message }
			});
			return { ...state, channels: channelsWithLastMessage };
		case SEND_NEW_CHANNEL:
			return { ...state, creatingNewChannel: action.payload };
		case CLEAR_CACHE_DATA:
			return { ...state, messages: [], members: [], channels: [], searchResults: [] };
		default: return state
	}
}

export default rootReducer;