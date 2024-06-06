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

export {
	useGetProfile,
	useChangeProfilePicture,
	useChangeProfileBanner,
	useChangeProfileInfo
};
