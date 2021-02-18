import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import request from "../utils/http";
import { hideReqisterForm } from "../redux/actions";

function RegisterForm() {

	const [form, setForm] = useState({
		email: '', password: '', name: ''
	});
	const [message, setMessage] = useState(null);
	const dispatch = useDispatch();
	const ref = useRef();

	async function registerHandler(event) {
		setMessage(null);

		if (form.email && form.password && form.name.length >= 2) {

			request('http://localhost:3001/api/auth/register', 'POST', {...form}).then((response) => {
				console.log(response);
				setMessage('Registration is successful! Now sign in!');
				setTimeout(() => {
					setMessage(null);
					dispatch(hideReqisterForm());
				}, 1000);
			}).catch(err => {
				setMessage(err.message);
				console.log(err);
			});

		} else {
			setMessage('Please fill all the fields!');
			setTimeout(() => {
				setMessage(null);
			}, 3000);
		}
	}
	
	function changeHandler(event) {
		setForm({ ...form, [event.target.name]: event.target.value });
	}

	function onClickOutside(e) {
		if (ref.current && !ref.current.contains(e.target)) {
			dispatch(hideReqisterForm());
		}
	}
	
	useEffect(() => {
		document.addEventListener("click", onClickOutside);
	
		return () => {
			document.removeEventListener("click", onClickOutside);
		};
	});

	return (
		<div className="user-form">
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

				<div className="form-actions">
					<button onClick={registerHandler} type="button">Create an account?</button>
				</div>
			</form>
		</div>
		
	);
}

export default RegisterForm;