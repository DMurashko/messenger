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
	SET_LAST_MESSAGE
} from './types';
import request from '../utils/http';

export function addMessage(message) {
	return {
		type: ADD_MESSAGE,
		payload: message
	}
}

export function addChannel(channel) {
	return {
		type: ADD_CHANNEL,
		payload: channel
	}
}

export function setActiveChannelId(channel) {
	return {
		type: SET_ACTIVE_CHANNEL_ID,
		payload: channel
	}
}

export function orderChannels() {
	return {
		type: ORDER_CHANNELS
	}
}

export function updateLastMessage(messageBody, channelToBeUpdated) {
	return {
		type: UPDATE_LAST_MESSAGE,
		payload: {
			lastMessage: {
				body: messageBody,
				created: (new Date()).getTime()
			},
			channelIndex: channelToBeUpdated,
		}
	}
}

export function orderChannelsByTheLatestMessage(channelToBeBroughtUp) {
	return {
		type: ORDER_CHANNELS_BY_THE_LATEST_MESSAGE,
		payload: channelToBeBroughtUp
	}
}

export function displaySearchBar() {
	return {
		type: DISPLAY_SEARCH_BAR
	}
}

export function hideSearchBar() {
	return {
		type: HIDE_SEARCH_BAR
	}
}

export function setSearchResults(results) {
	return {
		type: SET_SEARCH_RESULTS,
		payload: results
	}
}

export function addUserToChannel(channelIndex, userId) {
	return {
		type: ADD_USER_TO_CHANNEL,
		payload: {
			channelIndex,
			userId
		}
	}
}

export function removeUserFromChannel(channelIndex, userId) {
	return {
		type: REMOVE_USER_FROM_CHANNEL,
		payload: {
			channelIndex,
			userId
		}
	}
}

export function deleteChannel(channelId) {
	return {
		type: DELETE_CHANNEL,
		payload: channelId
	}
}

export function login(user) {
	return {
		type: LOGIN,
		payload: user
	}
}

export function displayUserForm() {
	return {
		type: DISPLAY_USER_FORM
	}
}

export function hideUserForm() {
	return {
		type: HIDE_USER_FORM
	}
}

export function displayUserMenu() {
	return {
		type: DISPLAY_USER_MENU
	}
}

export function hideUserMenu() {
	return {
		type: HIDE_USER_MENU
	}
}

export function addUserToMembers(user) {
	return {
		type: ADD_USER_TO_MEMBERS,
		payload: user
	}
}

export function fetchStatus(status) {
	return {
		type: FETCH_STATUS,
		payload: status
	}
}

export function requestSigninSuccess(status) {
	return {
		type: REQUEST_SIGN_IN_SUCCESS,
		payload: status
	}
}

export function setLastMessage(message, channelId) {
	return {
		type: SET_LAST_MESSAGE,
		payload: {
			message,
			channelId
		}
	}
}

export function fetchGetUserData(currentUser) {
	return async (dispatch) => {
		await dispatch(fetchStatus(true));
		try {
			//channels
			const fetchedChannels = await request(`http://localhost:3001/api/db/${currentUser.userId}/channels`, 'GET', null, {
				Authorization: `Bearer ${currentUser.token}`
			});
			let channels = fetchedChannels.channels;
			await dispatch(setActiveChannelId(channels[channels.length - 1]._id));
			channels.forEach( async (item) => {
				await dispatch(addChannel(item));
			});
			//users
			async function getChatMembers(channel) {
				channel.members.forEach(async (memberId) => {
					const fetchedUser = await request(`http://localhost:3001/api/db/${memberId}/user`, 'GET', null, {
						Authorization: `Bearer ${currentUser.token}`
					});
					let user = fetchedUser.user;
					await dispatch(addUserToMembers(user));
				});
			}
			channels.forEach(async (channel) => await getChatMembers(channel));
			//messages
			async function getChannelMessages(channel) {
				channel.messages.forEach(async (messageId) => {
					const fetchedMessages = await request(`http://localhost:3001/api/db/message/${messageId}`, 'GET', null, {
						Authorization: `Bearer ${currentUser.token}`
					});
					let message = fetchedMessages.message;
					await dispatch(setLastMessage(message, channel._id));
					message.me = message._id === currentUser._id;
					await dispatch(addMessage(message));
				});
			}
			channels.forEach(async (channel) => await getChannelMessages(channel));
			await dispatch(fetchStatus(false));
			await dispatch(requestSigninSuccess(true));
		} catch (err) {
			if (err.response && err.response.status === 401) {
				await dispatch(requestSigninSuccess(false));
				//localStorage.removeItem("currentUser");
			}
			console.log(err);
		}
	}
}