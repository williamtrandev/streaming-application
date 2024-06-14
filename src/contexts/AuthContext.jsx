import React, { createContext, useState, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useLocalStorage('auth', null);

	const login = (data) => {
		setAuth(data);
	};

	const logout = () => {
		setAuth(null);
	};

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
