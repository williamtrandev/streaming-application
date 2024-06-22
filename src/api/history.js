import APIClient from "../utils/APIClient";
import { useMutation, useQuery } from "@tanstack/react-query";

const writeHistory = async (data) => {
	const response = await APIClient.post("/history", data);
	return response.data;
}

const useWriteHistory = () => {
	return useMutation({
		mutationFn: (data) => writeHistory(data)
	})
}

export {
	useWriteHistory
};
