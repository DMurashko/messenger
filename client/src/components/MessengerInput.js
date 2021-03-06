import { useState } from "react";
import {ObjectId} from '../helpers/objectid';
import { useSelector, useDispatch } from 'react-redux';
import { 
	hideSearchBar, 
	sendNewChannel, 
	createNewMessage
} from "../redux/actions";

function MessengerInput(props) {
	const [newMessage, setNewMessage] = useState('');
	const activeChannelId = useSelector(state => state.activeChannelId);
	const currentUser = useSelector(state => state.currentUser);
	const channels = useSelector(state => state.channels);
	const isSearchBarRequired = useSelector(state => state.isSearchBarRequired);
	const creatingNewChannel = useSelector(state => state.creatingNewChannel);
	const dispatch = useDispatch();

	function onChangeHandler(event) {
		setNewMessage(event.target.value);
	}

	function handlerSend() {
		const messageId = new ObjectId().toString();
		const channelIndex = channels.findIndex(item => item._id === activeChannelId);
		const receiverId = channels[channelIndex].members.filter(member => {
			return member !== currentUser.userId;
		});
		const message = {
			_id: messageId,
			body: newMessage,
			channelId: activeChannelId,
			userId: currentUser.userId,
			me: true,
			receiverId: receiverId
		};
		if (isSearchBarRequired) {
			if (creatingNewChannel) {
				dispatch(sendNewChannel(channels[channelIndex], false, props.socketRef));
			}
			dispatch(hideSearchBar());
		}
		props.socketHandler(JSON.stringify(message));
		dispatch(createNewMessage(message, newMessage, channelIndex));
		setNewMessage('');
		//The feature below is going to be implemented in the future
		// if (checkWheatherUnique(channelIndex)) {
			
		// } else {
		// 	let thisChannel = activeChannelId;
		// 	dispatch(setActiveChannelId(channels[1]._id));
		// 	dispatch(deleteChannel(thisChannel));
		// }
	}

	// function checkWheatherUnique(channelIndex) {
	// 	const channelToCheck = channels[channelIndex];
	// 	const memberPairs = channels.splice(channelIndex, 1).map(channel => channel.members);
	// 	for (let pair of memberPairs) {
	// 		if (pair.length === channelToCheck.length) {
	// 			if (pair.every((val) => channelToCheck.find(val))) {
	// 				return false;
	// 			}
	// 		}
	// 	}

	// 	return true;
	// }

	return (
		<div className="messenger-input">
			<div className="text-input">
				<textarea 
				onKeyUp={ (event) => { if (event.key === 'Enter' && !event.shiftKey) {
					handlerSend()
				}}}
				onChange={onChangeHandler} 
				placeholder="Write your message" 
					value={newMessage}
				/>
			</div>
			<div className="actions">
				<button onClick={handlerSend} className="send">Send</button>
			</div>
		</div>
	);
}

export default MessengerInput;