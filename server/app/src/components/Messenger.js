import React, { useState, useEffect, useRef } from 'react';
import avatar from '../images/avatar.jpeg';
import {addChannel, addMessage, displaySearchBar, login, orderChannels, setActiveChannelId} from '../redux/actions';
import { useDispatch, useSelector} from 'react-redux';
import Channel from './Channel.js';
import Message from './Message.js';
import Member from './Member';
import MessengerInput from './MessengerInput';
import SearchBar from './SearchBar';
import {ObjectId} from '../helpers/objectid';
import UserBar from './UserBar';

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
			lastMessage: null,
			members: [currentUser],
			messages: [],
			created: new Date()
		}
		dispatch(addChannel(newChannel));
		dispatch(setActiveChannelId(channelId));
		dispatch(orderChannels());
		dispatch(displaySearchBar());
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
				lastMessage: {
					body: `Hey how do you do ${i}`,
					created: (new Date()).getTime()
				},
				members: [1, currentUser._id],
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
		//addTestMessages();

		return () => {
			console.log('Component did unmount');
			window.removeEventListener('resize', _onResize);
		}
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		const lastLoginnedUser = window.localStorage.getItem('currentUser');
		if (lastLoginnedUser)
			dispatch(login(JSON.parse(lastLoginnedUser)));
	}, []);

	useEffect(() => {
		window.localStorage.setItem('currentUser', JSON.stringify(currentUser));
	}, [currentUser]);

	return <div style={style} className="messenger">
		<header>
			<div className="left">
				<button className="left-action"><i className="icon-settings-streamline" /></button>
				<h2>Messenger</h2>
				<button onClick={onCreateChannel} className="right-action"><i className="icon-edit-modify-streamline" /></button>
			</div>

			<div className="content">
			{currentUser ? isSearchBarRequired ? <SearchBar /> :
			<h2>{channels.some(elem => typeof(elem) === 'string') && channels.find(item => item._id === activeChannelId).members.map(memberId => members.find(member => member._id === memberId).name).join(', ')}</h2> : null}
			</div>

			<div className="right">
				<UserBar />
			</div>
		</header>

		<main>
			<div className="sidebar-left">
				<div className="channels">
					{channels && channels.map((channel, index) => <Channel channel={channel} key={index}/>)}					
				</div>
			</div>

			<div className="content">

				<div className="messages">
					{messages && messages.filter(message => message.channelId === activeChannelId).map(message => <Message message={message} key={message._id} /> )}
					<div ref={messagesEndRef} />
				</div>
				
				{ currentUser ? typeof(activeChannelId) == 'number' || 'string' && channels.find(item => item._id === activeChannelId).members.length > 1 ? <MessengerInput /> : null : <p>Please authorize in the upper right corner!</p>}
				
			</div>
			<div className="sidebar-right">
				{(currentUser && typeof(activeChannelId) == 'number' || 'string') && !isUserFormRequired && channels.some(elem => typeof(elem) === 'string') && channels.find(item => item._id === activeChannelId).members.length > 1 ? 
				<div>
						<div className="title">Members</div>
						<div className="members">
							{channels.find(item => item._id === activeChannelId).members.map((memberId, index) => <Member memberId={memberId} key={index}/>)}
						</div>
				</div> : null}
			</div>
		</main>
	</div>
}

export default (Messenger);