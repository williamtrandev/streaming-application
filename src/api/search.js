import APIClient from "../utils/APIClient";
import { useMutation, useQuery } from "@tanstack/react-query";

const searchUsersForMod = async ({ q, limit, exclude }) => {
	const response = await APIClient.get(`/search/user?q=${q}&limit=${limit}&exclude=${exclude}`);
	return response.data;
}

const useSearchUsersForMod = ({ q, limit, exclude }) => {
	return useQuery({
		queryKey: ['searchUsers', { q, limit, exclude }],
		queryFn: () => searchUsersForMod({ q, limit, exclude }),
		enabled: !!q && !!exclude, 
	});
}


export {
	useSearchUsersForMod
};
