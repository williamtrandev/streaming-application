import APIClient from "../utils/APIClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const searchStreamers = async (q, page) => {
	const response = await APIClient.get(
		`/admin/streamers/page/${page}?
		q=${encodeURIComponent(q)}`
	);
	return response.data;
}

const useSearchStreamers = (q, page) => {
	return useQuery({
		queryKey: ["streameradmin", q, page],
		queryFn: () => searchStreamers(q, page),
		enabled: !!page,
		refetchOnWindowFocus: false
	});
}

const actionStreamer = async ({ streamerId, type }) => {
	const response = await APIClient.post(`/admin/action-streamer/${streamerId}?type=${type}`);
	return response.data;
}

const useActionStreamer = () => {
	return useMutation({
		mutationFn: (data) => actionStreamer(data)
	});
}

export {
	useSearchStreamers,
	useActionStreamer
};
