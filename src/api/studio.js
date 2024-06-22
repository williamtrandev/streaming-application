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

const getAllMods = async () => {
	const response = await APIClient.get('/studio/mod');
	return response.data;
}

const useGetAllMod = (userId) => {
	return useQuery({
		queryKey: ["Mods", userId],
		queryFn: () => getAllMods()
	})
}

const addMod = async (data) => {
	console.log(data)
	const response = await APIClient.post("/studio/mod", data);
	return response.data;
}

const useAddMod = () => {
	return useMutation({
		mutationFn: (data) => addMod(data)
	})
}

const deleteMod = async (modId) => {
	const response = await APIClient.delete(`/studio/mod/${modId}`);
	return response.data;
};

const useDeleteMod = () => {
	return useMutation({
		mutationFn: (modId) => deleteMod(modId)
	});
};

const getServerUrlAndStreamKey = async (username, streamId) => {
	const response = await APIClient.get(`/studio/stream-key/${username}/${streamId}`);
	return response.data;
}

const useGetServerUrlAndStreamKey = (username, streamId) => {
	return useQuery({
		queryKey: ["getstreamkey", username, streamId],
		queryFn: () => getServerUrlAndStreamKey(username, streamId),
		enabled: !!username && !!streamId,
		refetchOnWindowFocus: false
	})
}

const startStream = async (streamId) => {
	const response = await APIClient.put(`/studio/stream/${streamId}/start`);
	return response.data;
}

const useStartStream = () => {
	return useMutation({
		mutationFn: (streamId) => startStream(streamId)
	});
}

const endStream = async ({ streamId, egressId }) => {
	const response = await APIClient.put(`/studio/stream/${streamId}/end/${egressId}`);
	return response.data;
}

const useEndStream = () => {
	return useMutation({
		mutationFn: ({ streamId, egressId }) => endStream({ streamId, egressId })
	});
}

const generateStreamerToken = async (data) => {
	const response = await APIClient.post("/studio/streamer-token", data);
	return response.data;
}

const useGenerateStreamerToken = () => {
	return useMutation({
		mutationFn: (data) => generateStreamerToken(data)
	})
}

const generateViewerToken = async (data) => {
	const response = await APIClient.post("/studio/viewer-token", data);
	return response.data;
}

const useGenerateViewerToken = () => {
	return useMutation({
		mutationFn: (data) => generateViewerToken(data)
	})
}

const getStreamRecord = async (streamId) => {
	console.log("RECORD", streamId)
	const response = await APIClient.get(`/studio/record/${streamId}.mp4`);
	return response.data;
}

const useGetStreamRecord = (streamId) => {
	return useQuery({
		queryKey: ["record", streamId],
		queryFn: () => getStreamRecord(streamId),
		enabled: !!streamId
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
	useDeleteStream,
	useGetAllMod,
	useAddMod,
	useDeleteMod,
	useGetServerUrlAndStreamKey,
	useStartStream,
	useEndStream,
	useGenerateStreamerToken,
	useGenerateViewerToken,
	useGetStreamRecord
};
