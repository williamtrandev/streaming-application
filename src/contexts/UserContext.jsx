import React, { createContext, useState, useContext, useEffect } from 'react';
import { authEventEmitter } from './authEventEmitter';
const UserContext = createContext();

export const UserProvider = ({ children }) => {

	const [authUsername, setAuthUsername] = useState("");
	const [authFullname, setAuthFullname] = useState("");
	const [authProfilePicture, setAuthProfilePicture] = useState("");
	const [authProfilePictureS3, setAuthProfilePictureS3] = useState(null);
    const [authEmail, setAuthEmail] = useState("");
	const [followedChannels, setFollowedChannels] = useState([]);
	const [isLiveStreaming, setIsLiveStreaming] = useState(false);
	const [globalStreamId, setGlobalStreamId] = useState(null);
	const [globalEgressId, setGlobalEgressId] = useState(null);
	const logoutUser = () => {
		setAuthUsername("");
		setAuthFullname("");
		setAuthProfilePicture("");
		setAuthProfilePictureS3(null);
		setAuthEmail("");
		setFollowedChannels([]);
		setIsLiveStreaming(false);
		setGlobalStreamId(null);
		setGlobalEgressId(null);
	};
	useEffect(() => {
		const handleLogout = () => {
			logoutUser();
		};
		authEventEmitter.on('logout', handleLogout);

		return () => {
			authEventEmitter.off('logout', handleLogout);
		};
	}, []);

	return (
		<UserContext.Provider 
			value={{ 
				authUsername, setAuthUsername,
				authFullname, setAuthFullname,
				authProfilePicture, setAuthProfilePicture,
				authProfilePictureS3, setAuthProfilePictureS3,
                authEmail, setAuthEmail,
				followedChannels, setFollowedChannels,
				isLiveStreaming, setIsLiveStreaming,
				globalStreamId, setGlobalStreamId,
				globalEgressId, setGlobalEgressId,
				logoutUser
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
