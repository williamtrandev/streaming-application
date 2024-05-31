import axios from 'axios';

const APIClient = axios.create({
	baseURL: 'http://localhost:3000/api/v1',
	timeout: 8000,
	headers: {
		'Content-Type': 'application/json',
	},
});

export default APIClient;