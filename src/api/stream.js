import APIClient from "../utils/APIClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const getSavedStreams = async ({ pageParam, queryKey }) => {
	const username = queryKey[1];
	const response = await APIClient.get(`/stream/saved/${username}/${pageParam}`);
	return response.data;
}

const useGetSavedStreams = (username) => {
	return useInfiniteQuery({
		queryKey: ["savedStreams", username],
		queryFn: getSavedStreams,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const nextPage = lastPage.streams.length ? allPages.length + 1 : undefined;
			return nextPage;
		},
		enabled: !!username,
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

const getLikedStreams = async ({ pageParam, queryKey }) => {
	const userId = queryKey[1];
	const response = await APIClient.get(`/stream/liked/${userId}/${pageParam}`);
	return response.data;
}

const useGetLikedStreams = (userId) => {
	return useInfiniteQuery({
		queryKey: ["liked", userId],
		queryFn: getLikedStreams,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const nextPage = lastPage.histories.length ? allPages.length + 1 : undefined;
			return nextPage;
		},
		enabled: !!userId,
		refetchOnWindowFocus: false
	});
}

const getFollowingStreams = async ({ pageParam, queryKey }) => {
	console.log("querykey",queryKey);
	const userId = queryKey[1];
	const response = await APIClient.get(`/stream/following/${userId}/${pageParam}`);
	return response.data;
}

const useGetFollowingStreams = (userId) => {
	return useInfiniteQuery({
		queryKey: ["following", userId],
		queryFn: getFollowingStreams,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const nextPage = lastPage.streams.length ? allPages.length + 1 : undefined;
			return nextPage;
		},
		enabled: !!userId
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
