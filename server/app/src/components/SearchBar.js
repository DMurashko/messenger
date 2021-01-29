import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeUserFromChannel, setSearchResults } from '../redux/actions';
import SearchUser from './SearchUser';

function SearchBar(props) {

	const [searchUser, setSearchUser] = useState('');
	const dispatch = useDispatch();
	const members = useSelector(state => state.members);
	const activeChannelId = useSelector(state => state.activeChannelId);
	const channels = useSelector(state => state.channels);
	
	function searchUsers(search = "") {
		if (search.trim()) {
			const results = members.filter((user) => user.name.includes(search));
			dispatch(setSearchResults(results));
		}
	}

	function onChangeHandler(event) {
		setSearchUser(event.target.value);
	}

	function removeUser(user) {
		const channelIndex = channels.findIndex(channel => channel._id === activeChannelId);
		dispatch(removeUserFromChannel(channelIndex, user._id));
	}

	useEffect(() => {
		searchUsers(searchUser);
	}, [searchUser]);

	return (
		<div className="search-bar" >
			<label>To:</label>
			{	channels.some(elem => typeof(elem) === 'string') &&
				channels.find(channel => channel._id === activeChannelId).members.map((userId, key) => {
					return <span onClick={() => removeUser(userId)} key={key} >{members.find(member => member._id === userId).name}</span>
				})
			}
			<input placeholder="Type name of a person..." onChange={onChangeHandler} type="text" value={searchUser} />
			<SearchUser />
		</div>
	);
}

export default SearchBar;