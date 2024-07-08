import APIClient from "../utils/APIClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const searchChannels = async (key) => {
	const response = await APIClient.get(`/search/channel?key=${encodeURIComponent(key)}`);
	return response.data;
}

const useSearchChannels = (key) => {
	return useQuery({
		queryKey: ["channels", key],
		queryFn: () => searchChannels(key),
		enabled: !!key,
		refetchOnWindowFocus: false
	});
}

const searchStreams = async ({ pageParam, queryKey }) => {
	const key = queryKey[1];
	const response = await APIClient.get(`/search/stream?key=${encodeURIComponent(key)}&page=${pageParam}`);
	return response.data;
}

const useSearchStreams = (key) => {
	return useInfiniteQuery({
		queryKey: ["streams", key],
		queryFn: searchStreams,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const nextPage = lastPage.streams.length ? allPages.length + 1 : undefined;
			return nextPage;
		},
		enabled: !!key,
		refetchOnWindowFocus: false
	});
}

const searchHistory = async ({ pageParam, queryKey }) => {
	const userId = queryKey[1];
	const key = queryKey[2];
	const response = await APIClient.get(`/search/history/${userId}?key=${encodeURIComponent(key)}&page=${pageParam}`);
	return response.data;
}

const useSearchHistory = ({ userId, key}) => {
	return useInfiniteQuery({
		queryKey: ["history", userId, key],
		queryFn: searchHistory,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const nextPage = lastPage.histories.length ? allPages.length + 1 : undefined;
			return nextPage;
		},
		enabled: !!userId,
		refetchOnWindowFocus: false
	});
}

const searchUsersForMod = async ({ q, limit, exclude }) => {
	const response = await APIClient.get(`/search/user?q=${q}&limit=${limit}&exclude=${exclude}`);
	return response.data;
}

const useSearchUsersForMod = ({ q, limit, exclude }) => {
	return useQuery({
		queryKey: ['searchUsers', { q, limit, exclude }],
		queryFn: () => searchUsersForMod({ q, limit, exclude }),
		enabled: !!q && !!exclude, 
	});
}

const searchSavedStreams = async (key, page, date, numViews, numViewsLive) => {
	const response = await APIClient.get(
		`/search/saved-streams?
		key=${encodeURIComponent(key)}
		&page=${page}
		&date=${date}
		&numViews=${numViews}
		&numViewsLive=${numViewsLive}`
	);
	return response.data;
}

const useSearchSavedStreams = (key, page, date, numViews, numViewsLive) => {
	return useQuery({
		queryKey: ["savedstreamsstreamer", key, page, date, numViews, numViewsLive],
		queryFn: () => searchSavedStreams(key, page, date, numViews, numViewsLive),
		enabled: !!page,
		refetchOnWindowFocus: false
	});
}

export {
	useSearchChannels,
    useSearchStreams,
	useSearchHistory,
	useSearchUsersForMod,
	useSearchSavedStreams
};
