import avatar from '../images/avatar.jpeg';
import { setActiveChannelId } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

function Channel(props) {
	const dispatch = useDispatch();
	const activeChannelId = useSelector(state => state.activeChannelId);

	function onSelectChannel(key) {
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
					<h2>{props.channel.title}</h2>
					<p>{props.channel.lastMessage}</p>
				</div>
		</div>
	);
}

export default Channel;