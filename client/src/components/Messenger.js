import React, { useState, useEffect, useRef } from 'react';
import {
	setFetchStatus, 
	displaySearchBar, 
	fetchGetUserData, 
	login, 
	sendNewChannel,
	requestSigninSuccess,
	createNewChannel,
	createNewMessage
} from '../redux/actions';
import { useDispatch, useSelector} from 'react-redux';
import Channel from './Channel.js';
import Message from './Message.js';
import Member from './Member';
import MessengerInput from './MessengerInput';
import SearchBar from './SearchBar';
import {ObjectId} from '../helpers/objectid';
import UserBar from './UserBar';
import { io } from "socket.io-client";
import config from '../config.json';

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
	const isSearchBarRequired = useSelector(state => state.isSearchBarRequired);
	const isUserFormRequired = useSelector(state => state.isUserFormRequired);
	const fetchStatus = useSelector(state => state.fetchStatus);
	const signinSuccess = useSelector(state => state.signinSuccess);
	const dispatch = useDispatch();
	const messagesEndRef = useRef(null);
	const socketClientRef = useRef();

	function sendMessagesSocket(message) {
		if (message)
			socketClientRef.current.emit('message', message);
	}

	function _onResize() {
		setHeight(window.innerHeight);
	}

	function onCreateChannel() {
		const channelId = new ObjectId().toString();
		const newChannel = {
			_id: channelId,
			lastMessage: null,
			members: [currentUser.userId],
			messages: [],
			created: new Date()
		}
		disptach(createNewChannel(newChannel, channelId));
		dispatch(displaySearchBar());
		dispatch(sendNewChannel(null, true, socketClientRef));
	}

	function scrollToBottom() {
		if (messagesEndRef.current)
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
	}

	useEffect(() => {
		if (!!currentUser) {
			const socket = io(config.websocket.url + config.websocket.port, {
				transports: ['websocket'],
				upgrade: false
			});
			//sending currentUser id to the server in order to bind it to the id of current socket.id
			socket.on('connect', () => {
				socket.emit('setId', currentUser.userId);
			});
			//rendering a message from a peer
			socket.on('message', (message) => {
				console.log('message has arrived:', message);
				const channelIndex = channels.findIndex(item => item._id === message.channelId);
				message.me = message.userId === currentUser.userId;
				dispatch(createNewMessage(message, message.body, channelIndex));
			});
			//rendering a new channel created by a peer
			socket.on('receiveNewChannel', (channel) => {
				console.log('channel is created by a peer', channel);
				dispatch(createNewChannel(channel, channel._id));
			});
			socketClientRef.current = socket;
		}
	}, [currentUser]);

	useEffect(() => {
		console.log('Component did mount');
		window.addEventListener('resize', _onResize);

		return () => {
			console.log('Component did unmount');
			window.removeEventListener('resize', _onResize);
		}
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		const lastLoginnedUser = localStorage.getItem('currentUser');
		if (lastLoginnedUser !== 'undefined') {
			if (!!!JSON.parse(lastLoginnedUser))
				dispatch(requestSigninSuccess(false));
			if (!!JSON.parse(lastLoginnedUser)) {
				dispatch(setFetchStatus(true));
				dispatch(login(JSON.parse(lastLoginnedUser)));
			}
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('currentUser', JSON.stringify(currentUser));
		if (currentUser) {
			dispatch(fetchGetUserData(currentUser));
		}
	}, [currentUser]);

	return members && channels && messages ?

	 <div style={style} className="messenger">
		<header>
			<div className="left">
				<button className="left-action"><i className="icon-settings-streamline" /></button>
				<h2>Messenger</h2>
				<button onClick={onCreateChannel} className="right-action"><i className="icon-edit-modify-streamline" /></button>
			</div>

			<div className="content">
			{currentUser ? isSearchBarRequired ? <SearchBar /> :
			<h2>{ !!channels.length &&
				!!members.length &&
				!fetchStatus &&
				activeChannelId &&
				signinSuccess
				? channels
					.find(item => item._id === activeChannelId)
					.members
					.map(memberId => 
						members.find(member => member._id === memberId).name
					)
					.join(', ') 
				: null }
			</h2> : null}
			</div>

			<div className="right">
				<UserBar />
			</div>
		</header>

		<main>
			<div className="sidebar-left">
				<div className="channels">
					{!!channels.length && 
					!!members.length &&
					!fetchStatus &&
					signinSuccess && 
					channels.map((channel, index) => <Channel channel={channel} socketRef={socketClientRef} key={index}/>)}
				</div>
			</div>

			<div className="content">

				<div className="messages">
					{!!messages.length && 
					!!members.length &&
					!fetchStatus &&
					signinSuccess && 
					messages
						.filter(message => message.channelId === activeChannelId)
						.map(message => <Message message={message} key={message._id} /> )}
					<div ref={messagesEndRef} />
				</div>
				{ currentUser ? 
				(typeof(activeChannelId) == 'number' || 'string') && 
				!!channels.length &&
				!fetchStatus &&
				signinSuccess && 
				channels.find(item => item._id === activeChannelId).members.length > 1 ? 
					<MessengerInput socketRef={socketClientRef} socketHandler={sendMessagesSocket} /> : null : 
				<div className="please-auth">Please authorize in the upper right corner!</div>}
				
			</div>

			<div className="sidebar-right">
				{currentUser && 
				(typeof(activeChannelId) == 'number' || 'string') && 
				!fetchStatus &&
				signinSuccess && 
				!isUserFormRequired && 
				channels.length && 
				channels.find(item => item._id === activeChannelId).members.length > 1 ? 
				<div>
						<div className="title">Members</div>
						<div className="members">
							{channels
								.find(item => item._id === activeChannelId)
								.members
								.map((memberId, index) => <Member memberId={memberId} key={index}/>)}
						</div>
				</div> : null}
			</div>

		</main>
	</div> : null;
}

export default (Messenger);