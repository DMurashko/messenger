import avatar from '../images/avatar.jpeg';
import { useSelector} from 'react-redux';

function Member(props) {
	const members = useSelector(state => state.members);
	const currentMember = members.find(element => element._id === props.memberId);

	if (currentMember) {
		
		return (
			<div className="member">
				<div className="user-image">
					<img src={avatar} alt="" />
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