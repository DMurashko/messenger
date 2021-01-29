import classNames from 'classnames';

function Message(props) {
	const currentMessage = props.message;

	if (currentMessage) {
		
		return (
			<div className={classNames("message", {"me": currentMessage.me})}  >
				<div className="message-user-image">
					<img src={currentMessage.avatar} alt="Avatar" />
				</div>
				<div className="message-body">
					<div className="message-author">{currentMessage.me ? 'You' : currentMessage.user.name} says:</div>
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