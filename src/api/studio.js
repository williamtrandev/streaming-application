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


export {
	useSaveStream
};
