import React, { useState, useEffect, useRef } from 'react';
import avatar from '../images/avatar.jpeg';
import {addChannel, addMessage, orderChannels, setActiveChannelId} from '../redux/actions';
import { useDispatch, useSelector} from 'react-redux';
import Channel from './Channel.js';
import Message from './Message.js';
import Member from './Member';
import MessengerInput from './MessengerInput';
import {ObjectId} from '../helpers/objectid';

function Messenger() {

	const [height, setHeight] = useState(window.innerHeight);
	const style ={
		height: height,
	}
	const messages = useSelector(state => state.messages);
	const channels = useSelector(state => state.channels);
	const members = useSelector(state => state.members);
	const activeChannelId = useSelector(state => state.activeChannelId);
	const currentUser = useSelector(state => state.currentUser);
	const dispatch = useDispatch();
	const messagesEndRef = useRef(null);
	//Selecting the first channel and higlighting it
	// if (!activeChannelId) {
	// 	dispatch(setActiveChannelId(0));
	// }
	function _onResize() {
		setHeight(window.innerHeight);
	}

	function onCreateChannel() {
		const channelId = new ObjectId().toString();
		const newChannel = {
			_id: channelId,
			title: `New channel`,
			lastMessage: ``,
			members: [currentUser._id],
			created: new Date()
		}
		dispatch(addChannel(newChannel));
		dispatch(setActiveChannelId(channelId));
		console.log(channels[1].created.getTime());
		dispatch(orderChannels());
	}

	function addTestMessages() {

		//creating some test messages and dispatching them to Store
		for (let i = 2; i < 102; i++) {
			const messageId = new ObjectId().toString();
			let isMe = false;
			if (i % 2 === 0){
				isMe = true;
			}
			const newMsg = {
				_id: messageId,
				channelId: i % 10,
				user: {
					_id: i,
					name: `Author ${i}`,
					created: new Date(),
				},
				body: `The body of message ${i + 1}`,
				avatar: avatar,
				me: isMe
			}
			dispatch(addMessage(newMsg));
		}
		
		//creating some test channels
		for (let i = 1; i < 11; i++) {
			const newChannel = {
				_id: i,
				title: `Channel title ${i}`,
				lastMessage: `Hey how do you do ${i}`,
				members: [1],
				created: new Date()
			}
			dispatch(addChannel(newChannel));
		}
	}

	function scrollToBottom() {
		messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
	}

	useEffect(() => {
		console.log('Component did mount');
		window.addEventListener('resize', _onResize);
		addTestMessages();

		return () => {
			console.log('Component did unmount');
			window.removeEventListener('resize', _onResize);
		}
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return <div style={style} className="messenger">
		<header>
			<div className="left">
				<button className="left-action"><i className="icon-settings-streamline" /></button>
				<h2>Messenger</h2>
				<button onClick={onCreateChannel} className="right-action"><i className="icon-edit-modify-streamline" /></button>
			</div>
			<div className="content"><h2>Title</h2></div>
			<div className="right">
				<div className="user-bar">
					<div className="profile-name">Dmytro Murashko</div>
					<div className="profile-image"><img src="https://www.gravatar.com/avatar/542604b3def2e5c426487929b982693d" alt="Avatar" /></div>
				</div>
			</div>
		</header>

		<main>
			<div className="sidebar-left">
				<div className="channels">
					{channels.map((channel, index) => <Channel channel={channel} key={index}/>)}					
				</div>
			</div>

			<div className="content">

				<div className="messages">
					{messages.filter(message => message.channelId === activeChannelId).map(message => <Message message={message} key={message._id} /> )}
					<div ref={messagesEndRef} />
				</div>

				<MessengerInput />

			</div>
			<div className="sidebar-right">
				<div className="title">Members</div>
				<div className="members">
					{	channels.find(item => item._id === activeChannelId).members.map((memberId, index) => <Member memberId={memberId} key={index}/>)}
				</div>
			</div>
		</main>
	</div>
}

export default (Messenger);