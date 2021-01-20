import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideUserForm } from "../redux/actions";

function UserForm(props) {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState(null);
	const dispatch = useDispatch();
	const members = useSelector(state => state.members);
	const ref = useRef();

	function login(mail, password) {
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

	function onSubmit(event) {
		event.preventDefault();
		setMessage(null);
		
		if (email && password) {
			login(email, password).then(user => {
				console.log(user);
				setMessage(null);
			}).catch(err => {
				setMessage(err);
			});
		}
	}

	function onEmailFieldChange(event) {
		setEmail(event.target.value);
	}

	function onPasswordFieldChange(event) {
		setPassword(event.target.value);
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
			<form onSubmit={onSubmit} method="post" ref={ref} >

				{message ? <p className='app-message'>{message}</p> : null}
				
				<div className="form-item" >
					<label>Email</label>
					<input 
						onChange={onEmailFieldChange} 
						type="email" 
						placeholder="Email addresss..."
						value={email}
						name="email"
					></input>
				</div>

				<div className="form-item" >
					<label>Password</label>
					<input 
						onChange={onPasswordFieldChange} 
						type="password" 
						placeholder="Password..."
						value={password}
						name="password"
					></input>
				</div>

				<div className="form-actions">
					<button type="button">Create an account?</button>
					<button className="primary" type="submit">Sign In</button>
				</div>

			</form>
		</div>
	);
}

export default UserForm;