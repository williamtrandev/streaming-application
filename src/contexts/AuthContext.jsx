import React, { createContext, useEffect, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { authEventEmitter } from './authEventEmitter';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useLocalStorage('auth', null);

	const login = (data) => {
		setAuth(data);
	};

	const logout = () => {
		setAuth(null);
	};
	useEffect(() => {
		const handleLogout = () => {
			logout();
		};
		authEventEmitter.on('logout', handleLogout);

		return () => {
			authEventEmitter.off('logout', handleLogout);
		};
	}, []);

	return (
		<AuthContext.Provider 
			value={{ 
				auth, login, logout
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
