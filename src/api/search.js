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

const searchStreams = async (key) => {
	const response = await APIClient.get(`/search/stream?key=${encodeURIComponent(key)}`);
	return response.data;
}

const useSearchStreams = (key) => {
	return useQuery({
		queryKey: ["streams", key],
		queryFn: () => searchStreams(key),
		enabled: !!key,
		refetchOnWindowFocus: false
	});
}

export {
	useSearchChannels,
    useSearchStreams
};
