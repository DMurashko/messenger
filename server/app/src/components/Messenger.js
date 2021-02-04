import React, { useState, useEffect, useRef } from 'react';
import avatar from '../images/avatar.jpeg';
import {addChannel, addMessage, addUserToMembers, displaySearchBar, login, orderChannels, setActiveChannelId} from '../redux/actions';
import { useDispatch, useSelector} from 'react-redux';
import Channel from './Channel.js';
import Message from './Message.js';
import Member from './Member';
import MessengerInput from './MessengerInput';
import SearchBar from './SearchBar';
import {ObjectId} from '../helpers/objectid';
import UserBar from './UserBar';
import { useHttp } from '../hooks/http.hooks';
import Avatar from 'react-avatar';

function Messenger() {

	const [height, setHeight] = useState(window.innerHeight);
	const [test, setTest] = useState([]);
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
	const { request } = useHttp();

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

	function Test(test) {
		console.log(test.body, !!test.body);
		return (
			<p id="test">{!!test.body ? test.body: null}</p> 
		);
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
		console.log('checking LS');
		const lastLoginnedUser = window.localStorage.getItem('currentUser');
		if (lastLoginnedUser)
			dispatch(login(JSON.parse(lastLoginnedUser)));
	}, []);

	useEffect(() => {
		window.localStorage.setItem('currentUser', JSON.stringify(currentUser));
		async function userDataFetcher() {
			//channels
			const fetchedChannels = await request(`http://localhost:3001/api/db/${currentUser.userId}/channels`, 'GET', null, {
				Authorization: `Bearer ${currentUser.token}`
			});
			let channels = fetchedChannels.channels;
			dispatch(addChannel(channels));
			//users
			async function getChatMembers(channel) {
				channel.members.forEach(async (memberId) => {
					const fetchedUser = await request(`http://localhost:3001/api/db/${memberId}/user`, 'GET', null, {
						Authorization: `Bearer ${currentUser.token}`
					});
					let channels = fetchedUser.user;
					dispatch(addUserToMembers(fetchedUser));
				});
			}
			channels.forEach(async (channel) => await getChatMembers(channel));
			//messages
			async function getChannelMessages(channel) {
				channel.messages.forEach(async (messageId) => {
					const fetchedMessages = await request(`http://localhost:3001/api/db/message/${messageId}`, 'GET', null, {
						Authorization: `Bearer ${currentUser.token}`
					});
					let message = fetchedMessages.messages[0];
					message.me = message._id === currentUser._id;
					dispatch(addMessage(message));
				});
			}
			channels.forEach(async (channel) => await getChannelMessages(channel));
		}
		if (currentUser) {
			let fetched = userDataFetcher().catch(e => console.log(e));
		}
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
			<h2>{channels.length ? channels.find(item => item._id === activeChannelId).members.map(memberId => members.find(member => member._id === memberId).name).join(', ') : null }</h2> : null}
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
				<Avatar name="Foo Bar" size='40' round />
					{messages.length && messages.map(message => <Message message={message} key={message._id} /> )}
					{messages && messages.filter(message => message.channelId === activeChannelId).map(message => <Message message={message} key={message._id} /> )}
					<div ref={messagesEndRef} />
				</div>
				
				{ currentUser ? typeof(activeChannelId) == 'number' || 'string' && channels.find(item => item._id === activeChannelId).members.length > 1 ? <MessengerInput /> : null : <p>Please authorize in the upper right corner!</p>}
				
			</div>
			<div className="sidebar-right">
				{(currentUser && typeof(activeChannelId) == 'number' || 'string') && !isUserFormRequired && channels.length && channels.find(item => item._id === activeChannelId).members.length > 1 ? 
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