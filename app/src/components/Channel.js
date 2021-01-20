import avatar from '../images/avatar.jpeg';
import { deleteChannel, hideSearchBar, setActiveChannelId } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

function Channel(props) {
	const dispatch = useDispatch();
	const activeChannelId = useSelector(state => state.activeChannelId);
	const members = useSelector(state => state.members);
	const channels = useSelector(state => state.channels);

	function onSelectChannel(key) {
		if (channels.find(channel => channel._id === activeChannelId).members.length < 1) {
			console.log(activeChannelId, channels.find(channel => channel._id === activeChannelId).members.length < 1);
			dispatch(deleteChannel(activeChannelId));
			dispatch(hideSearchBar());
		}
		dispatch(setActiveChannelId(key));
	}
	
	return (
		<div 
			onClick={() => onSelectChannel(props.channel._id)} 
			className={classNames("channel", {"active-channel": props.channel._id === activeChannelId})}>
				<div className="user-image">
					<img src={avatar} alt="Avatar" />
				</div>
				<div className="channel-info">
					<h2>{props.channel.members && props.channel.members.map(memberId => members.find(member => member._id === memberId).name).join(' ')}</h2>
					<p>{props.channel.lastMessage.body}</p>
				</div>
		</div>
	);
}

export default Channel;