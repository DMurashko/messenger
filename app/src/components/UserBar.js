import avatar from '../images/avatar.jpeg';
import { useDispatch, useSelector} from 'react-redux';
import UserForm from './UserForm';
import { displayUserForm, hideUserForm } from '../redux/actions';

function UserBar(props) {

	const currentUser = useSelector(state => state.currentUser);
	const isUserFormRequired = useSelector(state => state.isUserFormRequired);
	const dispatch = useDispatch();

	function onClickHandler() {
		if (!isUserFormRequired) {
			dispatch(displayUserForm());
		} else {
			dispatch(hideUserForm());
		}
	}

	return (
		<div>
			<div className="user-bar">
				{!currentUser? <button onClick={onClickHandler} type="button" className="login-btn" >Sign In</button> : <div>
					<div className="profile-name">{currentUser.name}</div>
					<div className="profile-image"><img src={avatar} alt="Avatar" /></div>
				</div> }
			</div>
			{ !currentUser && isUserFormRequired ? <UserForm /> : null }
		</div>
	);
}

export default UserBar;