import axios from 'axios';
import { toast } from 'react-toastify';
import { authEventEmitter } from '../contexts/authEventEmitter';

const getAccessToken = () => {
	const auth = JSON.parse(localStorage.getItem("auth"));
	return auth?.accessToken;
};

const APIClient = axios.create({
	baseURL: import.meta.env.VITE_API_HOST,
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

APIClient.interceptors.response.use(
	(response) => {
		return response; 
	},
	async (error) => {
		const originalRequest = error.config; 
		
		if (error.response && error.response.status === 403 && !originalRequest._retry) {
			originalRequest._retry = true; 

			try {
				console.log("Trying to get token");
				const authData = JSON.parse(localStorage.getItem('auth'));
				const refreshToken = authData?.refreshToken;
				const response = await APIClient.post('/auth/refresh', { refreshToken });
				console.log(response);
				if(response.status != 200) {
					throw new Error("Error getting token");
				}
				localStorage.setItem('auth', JSON.stringify(response.data));

				originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;

				return axios(originalRequest);
			} catch (err) {
				console.error('Error refreshing token:', err);
				localStorage.removeItem('auth');
				toast.error("Please login again.");
				authEventEmitter.emit('logout');
				return Promise.reject(err); 
			}
		} 
		return Promise.reject(error);
	}
);

export default APIClient;