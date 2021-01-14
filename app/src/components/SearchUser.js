import avatar from '../images/avatar.jpeg';
import { useSelector } from "react-redux";

function SearchUser(props) {

	const users = useSelector(state => state.searchResults);

	return (
		<div className="search-user" >
			<div className="user-list" >

			{users.map((user, index) => {
				return (
				<div  key={index} className="user" >
					<img src={avatar} alt="Avatar" />
					<h2>{user.name}</h2>
				</div>
				);
			})}

			</div>
		</div>
	);
}

export default SearchUser;