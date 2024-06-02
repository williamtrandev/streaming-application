import APIClient from "../utils/APIClient";
import { useMutation, useQuery } from "@tanstack/react-query";

const sendMessage = async (data) => {
	const response = await APIClient.post("/chat/message", data);
	return response.data;
}

const useSendMessage = () => {
	return useMutation({
		mutationFn: (data) => sendMessage(data)
	})
}

const getMessages = async (streamId) => {
	const response = await APIClient.get(`/chat/message/${streamId}`);
	return response.data;
}

const useGetMessages = (streamId) => {
	return useQuery({
		queryKey: ["messages", streamId],
		queryFn: () => getMessages(streamId),
		enabled: !!streamId
	});
}


export { 
	useSendMessage,
	useGetMessages
};
