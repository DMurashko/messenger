import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCacheData, hideUserMenu, login, setFetchStatus, requestSigninSuccess } from "../redux/actions";

function UserMenu(props) {

	const dispatch = useDispatch();
	const ref = useRef();

	function onClickOutside(e) {
		if (ref.current && !ref.current.contains(e.target)) {
			dispatch(hideUserMenu());
		}
	}

	function signOutHandler() {
		dispatch(login(null));
		dispatch(clearCacheData());
		dispatch(hideUserMenu());
		dispatch(setFetchStatus(false));
		dispatch(requestSigninSuccess(false));
	}

	useEffect(() => {
		document.addEventListener("click", onClickOutside);
	
		return () => {
			document.removeEventListener("click", onClickOutside);
		};
	});

	return (
		<div className="user-menu" ref={ref} >
			<h2>My menu</h2>
			<ul className="menu">
				<li><button type="button">My Profile</button></li>
				<li><button type="button">Change Password</button></li>
				<li><button type="button" onClick={signOutHandler}>Sign Out</button></li>
			</ul>
		</div>
	);
}

export default UserMenu;