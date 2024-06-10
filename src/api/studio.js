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

const getDetailStream = async (streamId) => {
	console.log(streamId);
	const response = await APIClient.get(`/studio/stream/${streamId}`);
	return response.data;
}

const useGetDetailStream = (streamId) => {
	return useQuery({
		queryKey: ["DetailStream", streamId],
		queryFn: () => getDetailStream(streamId),
		enabled: !!streamId
	})
}

const getAllComingStreams = async () => {
	const response = await APIClient.get('/studio/coming-streams');
	return response.data;
}

const useGetAllComingStreams = (userId) => {
	return useQuery({
		queryKey: ["ComingStreams", userId],
		queryFn: () => getAllComingStreams()
	})
}

const editStream = async ({ streamId, data }) => {
	const response = await APIClient.put(`/studio/stream/${streamId}`, data);
	return response.data;
}

const useEditStream = () => {
	return useMutation({
		mutationFn: ({ streamId, data }) => editStream({ streamId, data })
	})
}

const deleteStream = async (streamId) => {
	const response = await APIClient.delete(`/studio/stream/${streamId}`);
	return response.data;
}

const useDeleteStream = () => {
	return useMutation({
		mutationFn: (streamId) => deleteStream(streamId)
	})
}
export {
	useSaveStream,
	useSaveNotification,
	useGetNotifications, 
	useGetStreamToken,
	useGetDetailStream,
	useGetAllComingStreams,
	useEditStream,
	useDeleteStream
};
