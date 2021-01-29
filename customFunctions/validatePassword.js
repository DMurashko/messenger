export default function validatePassword(password) {
	if ( !password.length || password.length < 8)
		return false;
	return true;
} 