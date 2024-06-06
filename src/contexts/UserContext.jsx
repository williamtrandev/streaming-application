import React, { createContext, useState, useContext } from 'react';
const UserContext = createContext();

export const UserProvider = ({ children }) => {

	const [authUsername, setAuthUsername] = useState("");
	const [authFullname, setAuthFullname] = useState("");
	const [authProfilePicture, setAuthProfilePicture] = useState("");
    const [authEmail, setAuthEmail] = useState("");

	return (
		<UserContext.Provider 
			value={{ 
				authUsername, setAuthUsername,
				authFullname, setAuthFullname,
				authProfilePicture, setAuthProfilePicture,
                authEmail, setAuthEmail
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
