import {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchResults } from '../redux/actions';
import SearchUser from './SearchUser';

function SearchBar(props) {

	const [searchUser, setSearchUser] = useState('');
	const dispatch = useDispatch();
	const members = useSelector(state => state.members);

	function searchUsers(search = "") {

		if (search.trim()) {

			const results = [];

			members.filter((user) => {
				if (user.name.includes(search)) {
					results.push(user);
				}
			});

			dispatch(setSearchResults(results));

		} else {
			dispatch(setSearchResults(members));
		}
	}

	return (
		<div>
			<label>To:</label>
			<input placeholder="Type name of a person..."
				onChange={(event) => {
				setSearchUser(event.target.value);
				searchUsers(searchUser);
			}} type="text" value={searchUser} />
			<SearchUser />
		</div>
	);
}

export default SearchBar;