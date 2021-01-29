import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../hooks/http.hooks";
import { hideUserForm } from "../redux/actions";
import { login } from '../redux/actions';

function getUserById(userId, users) {
	const user = users.find(user => user._id === userId);
	return user;
}

function UserForm() {

	const [form, setForm] = useState({
		email: '', password: ''
	});
	const [message, setMessage] = useState(null);
	const [isNameRequired, setIsNameRequired] = useState(false);
	const dispatch = useDispatch();
	const members = useSelector(state => state.members);
	const ref = useRef();
	const {loading, request} = useHttp();

	function enterCredentials(mail, password) {
		const mailHandled = mail.toString().toLowerCase();
		return new Promise((resolve, reject) => {
			const user = members.find(user => user.email === mailHandled);
			if (user) {
				dispatch(login(user));
				return resolve(user);
			} else {
				return reject('User not found');
			}
		});
	}

	async function registerHandler(event) {
		setMessage(null);

		if (isNameRequired && form.name.length >= 2) {
			if (form.email && form.password) {

				request('http://localhost:3001/api/auth/register', 'POST', {...form}).then(response => {
					console.log(response);
					setMessage(null);
				}).catch(err => {
					setMessage(err.message);
					console.log(err);
				});
				setIsNameRequired(false);
			}
		} else {
			setIsNameRequired(true);
			setMessage('Please enter your name');
			setTimeout(() => {
				setMessage(null);
			}, 3000);
		}
	}

	function logInHandler(event) {
		setMessage(null);
		if (form.email && form.password) {

			request('http://localhost:3001/api/auth/login', 'POST', {...form}).then(response => {
				console.log(response);
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
					></input>
				</div>

				{isNameRequired ? 
					<div className="form-item" >
						<label>Name</label>
						<input 
							onChange={changeHandler} 
							type="name" 
							placeholder="Enter your name..."
							value={form.name}
							name="name"
						></input>
					</div>
				: null}

				<div className="form-actions">
					<button onClick={registerHandler} type="button">Create an account?</button>
					<button onClick={logInHandler} className="primary" type="button">Sign In</button>
				</div>

			</form>
		</div>
	);
}

export default UserForm;