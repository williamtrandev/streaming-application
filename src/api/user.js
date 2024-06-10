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
	const { profilePicture } = data;
	const response = await APIClient.put("/user/change-profile-picture", {
		profilePicture
	});
	return response.data;
}

const useChangeProfilePicture = () => {
	return useMutation({
		mutationFn: (data) => changeProfilePicture(data)
	});
}

const changeProfileBanner = async (data) => {
	const { profileBanner } = data;
	const response = await APIClient.put("/user/change-profile-banner", {
		profileBanner
	});
	return response.data;
}

const useChangeProfileBanner = () => {
	return useMutation({
		mutationFn: (data) => changeProfileBanner(data)
	});
}

const changeProfileInfo = async (data) => {
	const { fullname, about } = data;
	const response = await APIClient.put("/user/change-profile-info", {
		fullname,
		about
	});
	return response.data;
}

const useChangeProfileInfo = () => {
	return useMutation({
		mutationFn: (data) => changeProfileInfo(data)
	});
}

const changeLinks = async (data) => {
	const { links } = data;
	const response = await APIClient.put("/user/change-links", {
		links
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

const getFollow = async ({ userId, streamerId }) => {
	const response = await APIClient.get(`/user/follow/${userId}/${streamerId}`);
	return response.data;
}

const useGetFollow = ({ userId, streamerId }) => {
	return useQuery({
		queryKey: ["follow", userId, streamerId],
		queryFn: () => getFollow({ userId, streamerId }),
		enabled: !!userId && !!streamerId,
		refetchOnWindowFocus: false
	});
}

const follow = async (data) => {
	const response = await APIClient.post("/user/follow", data);
	return response.data;
}

const useFollow = () => {
	return useMutation({
		mutationFn: (data) => follow(data)
	});
}

const toggleNotification = async (data) => {
	const response = await APIClient.put("/user/notification", data);
	return response.data;
}

const useToggleNotification = () => {
	return useMutation({
		mutationFn: (data) => toggleNotification(data)
	});
}

const unfollow = async (data) => {
	const { streamerId } = data;
	const response = await APIClient.delete(`/user/unfollow/${streamerId}`);
	return response.data;
}

const useUnfollow = () => {
	return useMutation({
		mutationFn: (data) => unfollow(data)
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
	useGetStreamerAbout,
	useGetFollow,
	useFollow,
	useToggleNotification,
	useUnfollow
};
