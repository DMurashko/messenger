import {ADD_CHANNEL, ADD_MESSAGE, GET_CHANNELS, GET_MESSAGES, SET_ACTIVE_CHANNEL_ID, ORDER_CHANNELS, UPDATE_LAST_MESSAGE, ORDER_CHANNELS_BY_THE_LATEST_MESSAGE} from './types';

export function addMessage(message) {
	return {
		type: ADD_MESSAGE,
		payload: message
	}
}

export function getMessages() {
	return {
		type: GET_MESSAGES
	}
}

export function addChannel(channel) {
	return {
		type: ADD_CHANNEL,
		payload: channel
	}
}

export function getChannels() {
	return {
		type: GET_CHANNELS
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
				created: (new Date).getTime()
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