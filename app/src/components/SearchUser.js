import avatar from '../images/avatar.jpeg';
import { useDispatch, useSelector } from "react-redux";
import { addUserToChannel } from '../redux/actions';

function User(props) {
	const activeChannelId = useSelector(state => state.activeChannelId);
	const channels = useSelector(state => state.channels);
	const dispatch = useDispatch();

	function onClickHandler(user) {
		const channelIndex = channels.findIndex(channel => channel._id === activeChannelId);
		dispatch(addUserToChannel(channelIndex, user._id));
	}

	return (
		<div onClick={() => onClickHandler(props.user)} className="user" >
			<img src={avatar} alt="Avatar" />
			<h2>{props.user.name}</h2>
		</div>
	);
}

function SearchUser(props) {

	const users = useSelector(state => state.searchResults);

	return (
		<div className="search-user" >
			<div className="user-list" >

			{users.map((user, index) => {
				return <User key={index} user={user} />
			})}

			</div>
		</div>
	);
}

export default SearchUser;