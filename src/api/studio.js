import APIClient from "../utils/APIClient";
import { useMutation, useQuery } from "@tanstack/react-query";

const saveStream = async (data) => {
	const response = await APIClient.post("/studio/stream", data);
	return response.data;
}

const useSaveStream = () => {
	return useMutation({
		mutationFn: (data) => saveStream(data)
	})
}

const saveNotification = async (data) => {
	const response = await APIClient.post("/studio/notification", data);
	return response.data;
}

const useSaveNotification = () => {
	return useMutation({
		mutationFn: (data) => saveNotification(data)
	})
}

const getNotifications = async () => {
	const response = await APIClient.get("/studio/notification");
	return response.data;
}

const useGetNotifications = (userId) => {
	return useQuery({
		queryKey: ["Notifications", userId],
		queryFn: () => getNotifications(),
		enabled: !!userId
	});
}

const getStreamToken = async (data) => {
	const response = await APIClient.post("/studio/stream/token", data);
	return response.data;
}

const useGetStreamToken = () => {
	return useMutation({
		mutationFn: (data) => getStreamToken(data)
	})
}

const getDetailStreamAndToken = async (streamId) => {
	console.log(streamId);
	const response = await APIClient.get(`/studio/stream/${streamId}`);
	return response.data;
}

const useGetDetailStreamAndToken = (streamId) => {
	return useQuery({
		queryKey: ["DetailStream", streamId],
		queryFn: () => getDetailStreamAndToken(streamId),
		enabled: !!streamId
	})
}

export {
	useSaveStream,
	useSaveNotification,
	useGetNotifications, 
	useGetStreamToken,
	useGetDetailStreamAndToken
};
