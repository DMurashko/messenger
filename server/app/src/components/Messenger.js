import React, { useState, useEffect, useRef } from 'react';
import avatar from '../images/avatar.jpeg';
import {addChannel, addMessage, addUserToMembers, displaySearchBar, fetchGetUserData, login, orderChannels, requestSigninSuccess, setActiveChannelId} from '../redux/actions';
import { useDispatch, useSelector} from 'react-redux';
import Channel from './Channel.js';
import Message from './Message.js';
import Member from './Member';
import MessengerInput from './MessengerInput';
import SearchBar from './SearchBar';
import {ObjectId} from '../helpers/objectid';
import UserBar from './UserBar';
import request from '../utils/http';
import Avatar from 'react-avatar';
import Test from './Test';

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
	const fetchStatus = useSelector(state => state.fetchStatus);
	const signinSuccess = useSelector(state => state.signinSuccess);
	const dispatch = useDispatch();
	const messagesEndRef = useRef(null);

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
		if (!!!JSON.parse(lastLoginnedUser))
			dispatch(requestSigninSuccess(false));
		if (!!JSON.parse(lastLoginnedUser)) {
			dispatch(requestSigninSuccess(true));
			dispatch(login(JSON.parse(lastLoginnedUser)));
		}

	}, []);

	useEffect(() => {
		window.localStorage.setItem('currentUser', JSON.stringify(currentUser));
		if (currentUser) {
			dispatch(fetchGetUserData(currentUser));
		}
	}, [currentUser]);

	//for testing purpose
	useEffect(() => {
		console.log('Members array:', members);
	}, [members]);
	useEffect(() => {
		console.log('Channels array:', channels);
	}, [channels]);
	useEffect(() => {
		console.log('Messages array:', messages);
	}, [messages]);

	return <div style={style} className="messenger">
		<header>
			<div className="left">
				<button className="left-action"><i className="icon-settings-streamline" /></button>
				<h2>Messenger</h2>
				<button onClick={onCreateChannel} className="right-action"><i className="icon-edit-modify-streamline" /></button>
			</div>

			<div className="content">
			{console.log('Mapping channels for user names', !!members.length ? members : 'no content', !!channels.length ? channels : 'no content')}
			{currentUser ? isSearchBarRequired ? <SearchBar /> :
			<h2>{ !!channels.length &&
				!!members.length &&
				!fetchStatus &&
				activeChannelId &&
				signinSuccess
				? channels.find(item => item._id === activeChannelId).members.map(memberId => members.find(member => member._id === memberId).name).join(', ') : null }</h2> : null}
			</div>

			<div className="right">
				{console.log('Right sidebar')}
				<UserBar />
			</div>
		</header>

		<main>
			<div className="sidebar-left">
				<div className="channels">
					{channels.length && 
					members.length &&
					!fetchStatus &&
					signinSuccess && 
					channels.map((channel, index) => <Channel channel={channel} key={index}/>)}
				</div>
			</div>

			<div className="content">

				<div className="messages">
					{/* {!!currentUser && <Test />} */}
					{messages.length && 
					!fetchStatus &&
					signinSuccess && 
					messages.map(message => <Message message={message} key={message._id} /> )}
					{messages && 
					!fetchStatus &&
					signinSuccess && 
					messages.filter(message => message.channelId === activeChannelId).map(message => <Message message={message} key={message._id} /> )}
					<div ref={messagesEndRef} />
				</div>
				
				{ currentUser ? 
				(typeof(activeChannelId) == 'number' || 'string') && 
				!fetchStatus &&
				signinSuccess && 
				channels.find(item => item._id === activeChannelId).members.length > 1 ? <MessengerInput /> : null : <div className="please-auth">Please authorize in the upper right corner!</div>}
				
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
							{channels.find(item => item._id === activeChannelId).members.map((memberId, index) => <Member memberId={memberId} key={index}/>)}
						</div>
				</div> : null}
			</div>
		</main>
	</div>
}

export default (Messenger);