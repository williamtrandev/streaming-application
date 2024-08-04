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

const overview = async (from, to) => {
	const response = await APIClient.get(
		`/admin/overview?from=${from}&to=${to}`
	);
	return response.data;
}

const useOverview = (from, to) => {
	return useQuery({
		queryKey: ["overview-admin", from, to],
		queryFn: () => overview(from, to),
		enabled: !!from && !!to,
		refetchOnWindowFocus: false
	});
}

const stats = async () => {
	const response = await APIClient.get(
		`/admin/stats`
	);
	return response.data;
}

const useStats = () => {
	return useQuery({
		queryKey: ["stats-admin"],
		queryFn: () => stats(),
		refetchOnWindowFocus: false
	});
}

export {
	useSearchStreamers,
	useActionStreamer,
	useOverview,
	useStats
};
