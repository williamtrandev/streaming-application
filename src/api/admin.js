import APIClient from "../utils/APIClient";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export { 
    useAdminLogin,
    useGetAdminSettings,
    useChangeAdminEmail,
    useChangeAdminPassword,
    useChangeAdminUsername
};
