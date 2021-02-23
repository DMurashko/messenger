export default async function request (url, method = 'GET', body = null, headers = {}) {
	try {
		if (body) {
			body = JSON.stringify(body);
			headers['Content-Type'] = 'application/json';
		}

		const response = await fetch(url, { method, body, headers});
		const data = await response.json();

		if (response.status === 401 && !response.ok) {
			throw new Error(401);
		}

		if (response.status !== 404 && !response.ok) {
			throw new Error(data.message || 'Something went wrong');
		}

		return data;
	} catch (e) {
		throw e;
	}
}
