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

	const changeAuthUsername = (username) => {
		const newAuth = auth;
		newAuth.user.username = username;
		setAuth(newAuth);
	};

	const changeAuthFullname = (fullname) => {
		const newAuth = auth;
		newAuth.user.fullname = fullname;
		setAuth(newAuth);
	};

	const changeAuthProfilePicture = (profilePicture) => {
		const newAuth = auth;
		newAuth.user.profilePicture = profilePicture;
		setAuth(newAuth);
	};

	return (
		<AuthContext.Provider value={{ auth, login, logout, changeAuthUsername, changeAuthFullname,changeAuthProfilePicture }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
