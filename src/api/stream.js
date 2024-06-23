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
		enabled: !!username,
		// refetchOnWindowFocus: false
	});
}

const getLikedStreams = async (page) => {
	const response = await APIClient.get(`/stream/liked/${page}`);
	return response.data;
}

const useGetLikedStreams = (page) => {
	return useQuery({
		queryKey: ["liked", page],
		queryFn: () => getLikedStreams(page),
		enabled: !!page,
		refetchOnWindowFocus: false
	});
}

const getFollowingStreams = async (page) => {
	const response = await APIClient.get(`/stream/following/${page}`);
	return response.data;
}

const useGetFollowingStreams = (page) => {
	return useQuery({
		queryKey: ["following", page],
		queryFn: () => getFollowingStreams(page),
		enabled: !!page,
		refetchOnWindowFocus: false
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

export {
    useGetSavedStreams,
	useGetHomeStreams,
	useGetLikedStreams,
	useGetFollowingStreams,
	useGetNumLikesAndDislikes
};
