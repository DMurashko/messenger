import Avatar from 'react-avatar';
import { useDispatch, useSelector} from 'react-redux';
import UserForm from './UserForm';
import { displayUserForm, displayUserMenu, hideUserForm } from '../redux/actions';
import UserMenu from './UserMenu';

function UserBar(props) {

	const currentUser = useSelector(state => state.currentUser);
	const isUserFormRequired = useSelector(state => state.isUserFormRequired);
	const isUserMenuRequired = useSelector(state => state.isUserMenuRequired);
	const dispatch = useDispatch();

	function onClickHandler() {
		if (!isUserFormRequired) {
			dispatch(displayUserForm());
		} else {
			dispatch(hideUserForm());
		}
	}

	function userMenuActivate() {
		dispatch(displayUserMenu());
	}

	return (
		<div>
			<div className="user-bar-container">
				{!currentUser? <button onClick={onClickHandler} type="button" className="login-btn" >Sign In</button> : <div className="user-bar">
					<div className="profile-name">{currentUser.name}</div>
					<div className="profile-image" onClick={userMenuActivate}><Avatar name={currentUser.name} size='40' round /></div>
				</div> }
			</div>
			{ !currentUser && isUserFormRequired ? <UserForm /> : null }
			{ isUserMenuRequired ? <UserMenu /> : null }
		</div>
	);
}

export default UserBar;