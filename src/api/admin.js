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

const login = async (data) => {
    const { username, password } = data;
    const response = await APIClient.post("/admin/login", {
        username,
        password
    });
    return response.data;
}

const useAdminLogin = () => {
    return useMutation({
        mutationFn: (data) => login(data)
    });
}

const getAdminSettings = async () => {
	const response = await APIClient.get(`/admin`);
	return response.data;
}

const useGetAdminSettings = () => {
	return useQuery({
		queryKey: ["settings"],
		queryFn: () => getAdminSettings(),
		// enabled: !!userId,
        refetchOnWindowFocus: false
	});
}

const changeEmail = async (data) => {
	const { email, otp } = data;
	const response = await APIClient.put("/admin/email", {
		email,
        otp
	});
	return response.data;
}

const useChangeAdminEmail = () => {
	return useMutation({
		mutationFn: (data) => changeEmail(data)
	});
}

const changePassword = async (data) => {
    const { oldPassword, newPassword } = data;
    const response = await APIClient.put("/admin/password", {
        oldPassword,
        newPassword
    });
    return response.data;
}

const useChangeAdminPassword = () => {
    return useMutation({
        mutationFn: (data) => changePassword(data)
    });
}

const changeUsername = async (data) => {
    const { username, password } = data;
    const response = await APIClient.put("/admin/username", {
        username,
        password
    });
    return response.data;
}

const useChangeAdminUsername = () => {
    return useMutation({
        mutationFn: (data) => changeUsername(data)
    });
}

const searchStreams = async (key, page) => {
	const response = await APIClient.get(
		`/admin/search-streams?
		key=${encodeURIComponent(key)}
		&page=${page}`
	);
	return response.data;
}

const useSearchStreamsAdmin = (key, page) => {
	return useQuery({
		queryKey: ["AdminSearchStream", key, page],
		queryFn: () => searchStreams(key, page),
		enabled: !!page,
		refetchOnWindowFocus: false
	});
}

const banStream = async (data) => {
    const { streamId } = data;
    const response = await APIClient.put(`/admin/ban-stream/${streamId}`);
    return response.data;
}

const useBanStream = () => {
    return useMutation({
        mutationFn: (data) => banStream(data)
    });
}

export {
	useSearchStreamers,
	useActionStreamer,
    useAdminLogin,
    useGetAdminSettings,
    useChangeAdminEmail,
    useChangeAdminPassword,
    useChangeAdminUsername,
    useSearchStreamsAdmin,
	useBanStream
};
