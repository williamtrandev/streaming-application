import APIClient from "../utils/APIClient";
import { useMutation, useQuery } from "@tanstack/react-query";

const getSavedStreams = async ({ username, page }) => {
	const response = await APIClient.get(`/stream/saved/${username}/${page}`);
	return response.data;
}

const useGetSavedStreams = ({ username, page }) => {
	return useQuery({
		queryKey: ["savedstreams", username, page],
		queryFn: () => getSavedStreams({ username, page }),
		enabled: !!username && !!page,
		refetchOnWindowFocus: false
	});
}

const getHomeStreams = async (username) => {
	const response = await APIClient.get(`/stream/home/${username}`);
	return response.data;
}

const useGetHomeStreams = (username) => {
	return useQuery({
		queryKey: ["homestreams", username],
		queryFn: () => getHomeStreams(username),
		enabled: !!username
	});
}

const getLikedStreams = async (userId, page) => {
	const response = await APIClient.get(`/stream/liked/${userId}/${page}`);
	return response.data;
}

const useGetLikedStreams = (userId, page) => {
	return useQuery({
		queryKey: ["liked", userId, page],
		queryFn: () => getLikedStreams(userId, page),
		enabled: !!userId && !!page,
		refetchOnWindowFocus: false
	});
}

const getFollowingStreams = async (userId, page) => {
	const response = await APIClient.get(`/stream/following/${userId}/${page}`);
	return response.data;
}

const useGetFollowingStreams = (userId, page) => {
	return useQuery({
		queryKey: ["following", userId, page],
		queryFn: () => getFollowingStreams(userId, page),
		enabled: !!userId && !!page
	});
}

const getNumLikesAndDislikes = async (streamId) => {
	const response = await APIClient.get(`/stream/likes-dislikes/${streamId}`);
	return response.data;
}

const useGetNumLikesAndDislikes = (streamId) => {
	return useQuery({
		queryKey: ["LikesAndDislikes", streamId],
		queryFn: () => getNumLikesAndDislikes(streamId),
		enabled: !!streamId,
		refetchInterval: 60000
	});
}

const getHomePageStreams = async (userId) => {
	const response = await APIClient.get(`/stream/home?userId=${userId}`);
	return response.data;
}

const useGetHomePageStreams = (userId) => {
	return useQuery({
		queryKey: ["HomePage", userId],
		queryFn: () => getHomePageStreams(userId),
		refetchOnWindowFocus: false
	});
}

export {
    useGetSavedStreams,
	useGetHomeStreams,
	useGetLikedStreams,
	useGetFollowingStreams,
	useGetNumLikesAndDislikes,
	useGetHomePageStreams
};
