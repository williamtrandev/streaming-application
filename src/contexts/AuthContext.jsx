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

	const [authUsername, setAuthUsername] = useState("");
	const [authFullname, setAuthFullname] = useState("");
	const [authProfilePicture, setAuthProfilePicture] = useState("");

	return (
		<AuthContext.Provider 
			value={{ 
				auth, login, logout,
				authUsername, setAuthUsername,
				authFullname, setAuthFullname,
				authProfilePicture, setAuthProfilePicture
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
