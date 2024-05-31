import APIClient from "../utils/APIClient";
import { useMutation } from "@tanstack/react-query";

const sendMessage = async (data) => {
	const response = await APIClient.post("/chat/message", data);
	return response.data;
}

const useSendMessage = () => {
	return useMutation({
		mutationFn: (data) => sendMessage(data)
	})
}

export { useSendMessage };
