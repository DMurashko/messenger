import classNames from 'classnames';
import Avatar from 'react-avatar';
import { useSelector } from 'react-redux';

function Message(props) {
	const currentMessage = props.message;
	const members = useSelector(state => state.members);
	currentMessage.name = members.find(member => member._id === currentMessage.userId).name;

	if (currentMessage) {
		
		return (
			<div className={classNames("message", {"me": currentMessage.me})}  >
				<div className="message-user-image">
					<Avatar name={currentMessage.name} size='40' round />
				</div>
				<div className="message-body">
					<div className="message-author">{currentMessage.me ? 'You' : currentMessage.name} says:</div>
					<div className="message-text">
						<p>{currentMessage.body}</p>
					</div>
				</div>
			</div>
		);
	} else {
		return null;
	}
}

export default Message;