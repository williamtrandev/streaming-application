import APIClient from "../utils/APIClient";
import { useMutation, useQuery } from "@tanstack/react-query";

const getProfile = async (userId) => {
	const response = await APIClient.get(`/user/profile/${userId}`);
	return response.data;
}

const useGetProfile = (userId) => {
	return useQuery({
		queryKey: ["profile", userId],
		queryFn: () => getProfile(userId),
		enabled: !!userId,
		refetchOnWindowFocus: false
	});
}

const getMiniProfile = async (userId) => {
	const response = await APIClient.get(`/user/mini-profile/${userId}`);
	return response.data;
}

const useGetMiniProfile = (userId) => {
	return useQuery({
		queryKey: ["miniprofile", userId],
		queryFn: () => getMiniProfile(userId),
		enabled: !!userId,
		refetchOnWindowFocus: false
	});
}

const changeProfilePicture = async (data) => {
	const { token, profilePicture } = data;
	const formData = new FormData();
	formData.append('file', profilePicture);
	const response = await APIClient.put("/user/change-profile-picture", formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
			'Authorization': `Bearer ${token}`
		},
	});
	return response.data;
}

const useChangeProfilePicture = () => {
	return useMutation({
		mutationFn: (data) => changeProfilePicture(data)
	});
}

const changeProfileBanner = async (data) => {
	const { token, profileBanner } = data;
	const formData = new FormData();
	formData.append('file', profileBanner);
	const response = await APIClient.put("/user/change-profile-banner", formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
			'Authorization': `Bearer ${token}`
		},
	});
	return response.data;
}

const useChangeProfileBanner = () => {
	return useMutation({
		mutationFn: (data) => changeProfileBanner(data)
	});
}

const changeProfileInfo = async (data) => {
	const { token, fullname, about } = data;
	const response = await APIClient.put("/user/change-profile-info", {
		fullname,
		about
	}, {
		headers: {
			'Authorization': `Bearer ${token}`
		},
	});
	return response.data;
}

const useChangeProfileInfo = () => {
	return useMutation({
		mutationFn: (data) => changeProfileInfo(data)
	});
}

const changeLinks = async (data) => {
	const { token, links } = data;
	const response = await APIClient.put("/user/change-links", {
		links
	}, {
		headers: {
			'Authorization': `Bearer ${token}`
		},
	});
	return response.data;
}

const useChangeLinks = () => {
	return useMutation({
		mutationFn: (data) => changeLinks(data)
	});
}

const getEmail = async (userId) => {
	const response = await APIClient.get(`/user/email/${userId}`);
	return response.data;
}

const useGetEmail = (userId) => {
	return useQuery({
		queryKey: ["email", userId],
		queryFn: () => getEmail(userId),
		enabled: !!userId,
		refetchOnWindowFocus: false
	});
}

const getStreamerProfile = async (username) => {
	const response = await APIClient.get(`/user/channel/${username}`);
	return response.data;
}

const useGetStreamerProfile = (username) => {
	return useQuery({
		queryKey: ["streamerprofile", username],
		queryFn: () => getStreamerProfile(username),
		enabled: !!username,
		refetchOnWindowFocus: false
	});
}

const getStreamerAbout = async (username) => {
	const response = await APIClient.get(`/user/about/${username}`);
	return response.data;
}

const useGetStreamerAbout = (username) => {
	return useQuery({
		queryKey: ["streamerabout", username],
		queryFn: () => getStreamerAbout(username),
		enabled: !!username,
		refetchOnWindowFocus: false
	});
}

export {
	useGetProfile,
	useGetMiniProfile,
	useChangeProfilePicture,
	useChangeProfileBanner,
	useChangeProfileInfo,
	useChangeLinks,
	useGetEmail,
	useGetStreamerProfile,
	useGetStreamerAbout
};
