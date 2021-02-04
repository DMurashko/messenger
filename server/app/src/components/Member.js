import Avatar from 'react-avatar';
import { useSelector} from 'react-redux';

function Member(props) {
	const members = useSelector(state => state.members);
	const currentMember = members.find(element => element._id === props.memberId);

	if (currentMember) {
		
		return (
			<div className="member">
				<div className="user-image">
					<Avatar name={currentMember.name} size='40' round />
				</div>
				<div className="member-info">
					<h2>{currentMember.name}</h2>
					<p>Joined: {currentMember.created.toJSON().slice(0,10).split('-').reverse().join('/')}</p>
				</div>
			</div>
		);

	} else {

		return null;
	}
}

export default Member;