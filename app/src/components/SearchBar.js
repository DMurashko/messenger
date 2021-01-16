import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchResults } from '../redux/actions';
import SearchUser from './SearchUser';

function SearchBar(props) {

	const [searchUser, setSearchUser] = useState('');
	const dispatch = useDispatch();
	const members = useSelector(state => state.members);

	function searchUsers(search = "") {
		if (search.trim()) {
			const results = members.filter((user) => user.name.includes(search));
			dispatch(setSearchResults(results));
		}
	}

	function onChangeHandler(event) {
		setSearchUser(event.target.value);
	}

	useEffect(() => {
		searchUsers(searchUser);
	}, [searchUser])

	return (
		<div>
			<label>To:</label>
			<input placeholder="Type name of a person..." onChange={onChangeHandler} type="text" value={searchUser} />
			<SearchUser />
		</div>
	);
}

export default SearchBar;