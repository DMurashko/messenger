import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import request from "../utils/http";
import { hideUserForm } from "../redux/actions";
import { login } from '../redux/actions';

function UserForm() {

	const [form, setForm] = useState({
		email: '', password: ''
	});
	const [message, setMessage] = useState(null);
	const [isNameRequired, setIsNameRequired] = useState(false);
	const dispatch = useDispatch();
	const signinSuccess = useSelector(state => state.signinSuccess);
	const ref = useRef();

	function logInHandler(event) {
		setMessage(null);
		if (form.email && form.password) {

			request('http://localhost:3001/api/auth/login', 'POST', {...form}).then(response => {
				console.log(response);
				dispatch(hideUserForm());
				dispatch(login(response));
				setMessage(null);
			}).catch(err => {
				setMessage(err.message);
				console.log(err);
			});
			setIsNameRequired(false);
		}
	}

	function changeHandler(event) {
		setForm({ ...form, [event.target.name]: event.target.value });
	}

	function onClickOutside(e) {
		if (ref.current && !ref.current.contains(e.target)) {
			dispatch(hideUserForm());
			setIsNameRequired(false);
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