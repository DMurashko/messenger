import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import request from "../utils/http";
import { 
	hideUserForm,
	clearCacheData,
	login, 
	setFetchStatus, 
	requestSigninSuccess, 
	fullLogIn
} from "../redux/actions";

function UserForm() {

	const [form, setForm] = useState({
		email: '', password: ''
	});
	const [message, setMessage] = useState(null);
	const dispatch = useDispatch();
	const ref = useRef();

	function logInHandler() {
		dispatch(fullLogIn(form, setMessage));
	}

	function changeHandler(event) {
		setForm({ ...form, [event.target.name]: event.target.value });
	}

	function onClickOutside(e) {
		if (ref.current && !ref.current.contains(e.target)) {
			dispatch(hideUserForm());
		}
	}
	
	useEffect(() => {
		document.addEventListener("click", onClickOutside);
	
		return () => {
			document.removeEventListener("click", onClickOutside);
		};
	});

	return (
		<div className="user-form" >
			<form method="post" ref={ref} >

				{message ? <p className='app-message'>{message}</p> : null}
				
				<div className="form-item" >
					<label>Email</label>
					<input 
						onChange={changeHandler} 
						type="email" 
						placeholder="Email addresss..."
						value={form.email}
						name="email"
						autoComplete="username"
					></input>
				</div>

				<div className="form-item" >
					<label>Password</label>
					<input 
						onChange={changeHandler} 
						type="password" 
						placeholder="Password..."
						value={form.password}
						name="password"
						autoComplete="current-password"
					></input>
				</div>

				<div className="form-actions">
					<button onClick={logInHandler} className="primary" type="button">Sign In</button>
				</div>

			</form>
		</div>
	);
}

export default UserForm;