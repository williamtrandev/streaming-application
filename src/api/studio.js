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

export {
	useSaveStream,
	useSaveNotification,
	useGetNotifications, 
	useGetStreamToken
};
