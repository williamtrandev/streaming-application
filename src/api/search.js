import APIClient from "../utils/APIClient";
import { useMutation, useQuery } from "@tanstack/react-query";

const searchChannels = async (key) => {
	const response = await APIClient.get(`/search/user?key=${encodeURIComponent(key)}`);
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

const searchStreams = async ({ key, page }) => {
	const response = await APIClient.get(`/search/stream?key=${encodeURIComponent(key)}&page=${page}`);
	return response.data;
}

const useSearchStreams = ({ key, page }) => {
	return useQuery({
		queryKey: ["streams", key, page],
		queryFn: () => searchStreams({ key, page }),
		enabled: !!key && !!page,
		refetchOnWindowFocus: false
	});
}

const searchHistory = async ({ key, page }) => {
	const response = await APIClient.get(`/search/history?key=${encodeURIComponent(key)}&page=${page}`);
	return response.data;
}

const useSearchHistory = ({ key, page }) => {
	return useQuery({
		queryKey: ["history", key, page],
		queryFn: () => searchHistory({ key, page }),
		enabled: !!page,
		refetchOnWindowFocus: false
	});
}

export {
	useSearchChannels,
    useSearchStreams,
	useSearchHistory
};
