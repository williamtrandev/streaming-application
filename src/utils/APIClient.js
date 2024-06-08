import axios from 'axios';

const getAccessToken = () => {
	const auth = JSON.parse(localStorage.getItem("auth"));
	return auth?.accessToken;
};

const APIClient = axios.create({
	baseURL: 'http://localhost:3000/api/v1',
	timeout: 8000,
	headers: {
		'Content-Type': 'application/json',
	},
});

APIClient.interceptors.request.use(
	(config) => {
		const token = getAccessToken();
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default APIClient;