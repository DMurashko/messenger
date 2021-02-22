import Avatar from 'react-avatar';
import { useDispatch, useSelector} from 'react-redux';
import UserForm from './UserForm';
import { displayReqisterForm, displayUserForm, displayUserMenu, hideReqisterForm, hideUserForm } from '../redux/actions';
import UserMenu from './UserMenu';
import RegisterForm from './RegisterForm';

function UserBar(props) {

	const currentUser = useSelector(state => state.currentUser);
	const isUserFormRequired = useSelector(state => state.isUserFormRequired);
	const isRegisterFormRequired = useSelector(state => state.isRegisterFormRequired);
	const isUserMenuRequired = useSelector(state => state.isUserMenuRequired);
	const dispatch = useDispatch();

	function onSignInHandler() {
		if (!isUserFormRequired) {
			dispatch(displayUserForm());
		} else {
			dispatch(hideUserForm());
		}
	}

	function onRegisterHandler() {
		if (!isRegisterFormRequired) {
			dispatch(displayReqisterForm());
		} else {
			dispatch(hideReqisterForm());
		}
	}

	function userMenuActivate() {
		dispatch(displayUserMenu());
	}

	return (
		<div>
			<div className="user-bar-container">
				{!currentUser? 
					<div>
						<button onClick={onSignInHandler} type="button" className="login-btn" >Sign In</button> 
						<button onClick={onRegisterHandler} type="button" className="login-btn register-button" >Register</button>
					</div>: 
						<div className="user-bar">
							<div className="profile-name">{currentUser.name}</div>
							<div className="profile-image" onClick={userMenuActivate}><Avatar name={currentUser.name} size='40' round /></div>
						</div> 
				}
			</div>
			{ !currentUser && isUserFormRequired ? <UserForm /> : null }
			{ !currentUser && isRegisterFormRequired ? <RegisterForm /> : null }
			{ isUserMenuRequired ? <UserMenu /> : null }
		</div>
	);
}

export default UserBar;