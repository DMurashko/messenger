import { useState } from "react";
import {ObjectId} from '../helpers/objectid';
import avatar from '../images/avatar.jpeg';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, updateLastMessage, orderChannelsByTheLatestMessage } from "../redux/actions";

function MessengerInput() {
	const [newMessage, setNewMessage] = useState('');
	const activeChannelId = useSelector(state => state.activeChannelId);
	const currentUser = useSelector(state => state.currentUser);
	const channels = useSelector(state => state.channels);
	const dispatch = useDispatch();

	function onChangeHandler(event) {
		setNewMessage(event.target.value);
	}

	function handlerSend(event) {
		const messageId = new ObjectId().toString();
		const channelIndex = channels.findIndex(item => item._id === activeChannelId);
		const message = {
			_id: messageId,
			body: newMessage,
			channelId: activeChannelId,
			user: {
				_id: currentUser._id,
				name: currentUser.name,
				created: currentUser.created,
			},
			avatar: avatar,
			me: true
		};
		dispatch(addMessage(message));
		dispatch(updateLastMessage(newMessage, channelIndex));
		dispatch(orderChannelsByTheLatestMessage(channelIndex));
		setNewMessage('');
	}

	return (
		<div className="messenger-input">
			<div className="text-input">
				<textarea 
				onKeyUp={ (event) => { if (event.key === 'Enter' && !event.shiftKey) {
					handlerSend(event)
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