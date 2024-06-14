import React, { createContext, useState, useContext } from 'react';
const UserContext = createContext();

export const UserProvider = ({ children }) => {

	const [authUsername, setAuthUsername] = useState("");
	const [authFullname, setAuthFullname] = useState("");
	const [authProfilePicture, setAuthProfilePicture] = useState("");
    const [authEmail, setAuthEmail] = useState("");
	const [followedChannels, setFollowedChannels] = useState([]);

	const logoutUser = () => {
		setAuthUsername("");
		setAuthFullname("");
		setAuthProfilePicture("");
		setAuthEmail("");
		setFollowedChannels("");
	};

	return (
		<UserContext.Provider 
			value={{ 
				authUsername, setAuthUsername,
				authFullname, setAuthFullname,
				authProfilePicture, setAuthProfilePicture,
                authEmail, setAuthEmail,
				followedChannels, setFollowedChannels,
				logoutUser
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
