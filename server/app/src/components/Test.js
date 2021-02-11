import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import request from '../utils/http';

function Test(props) {
	const currentUser = useSelector(state => state.currentUser);
	const [data, dataSet] = useState(false);

    async function fetchMyAPI() {
		const fetchedChannels = await request(`http://localhost:3001/api/db/${currentUser.userId}/channels`, 'GET', null, {
			Authorization: `Bearer ${currentUser.token}`
		});
		console.log(fetchedChannels);
		dataSet(fetchedChannels.channels);
    }

    useEffect(() => {
		fetchMyAPI().catch(e => console.log(e, e.response));
    }, []);

  return <div>{data.length && data[0].members[0]}</div>
}

export default Test;