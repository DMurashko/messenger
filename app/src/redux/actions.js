import {ADD_CHANNEL, ADD_MESSAGE, SET_ACTIVE_CHANNEL_ID, ORDER_CHANNELS, UPDATE_LAST_MESSAGE, ORDER_CHANNELS_BY_THE_LATEST_MESSAGE, DISPLAY_SEARCH_BAR, HIDE_SEARCH_BAR, SET_SEARCH_RESULTS, ADD_USER_TO_CHANNEL } from './types';

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

export function addUserToChannel(channelIndex, user) {
	return {
		type: ADD_USER_TO_CHANNEL,
		payload: {
			channelIndex,
			user
		}
	}
}