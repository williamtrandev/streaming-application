import APIClient from "../utils/APIClient";
import { useMutation, useQuery } from "@tanstack/react-query";

const login = async (data) => {
    const { username, password } = data;
    const response = await APIClient.post("/auth/login", {
        username,
        password
    });
    return response.data;
}

const useLogin = () => {
    return useMutation({
        mutationFn: (data) => login(data)
    });
}

const checkUsernameAvailable = async (data) => {
    const { username } = data;
    const response = await APIClient.post("/auth/check/username-available", {
        username
    });
    return response.data;
}

const useCheckUsernameAvailable = () => {
    return useMutation({
        mutationFn: (data) => checkUsernameAvailable(data)
    });
}

const checkEmailAvailable = async (data) => {
    const { email } = data;
    const response = await APIClient.post("/auth/check/email-available", {
        email
    });
    return response.data;
}

const useCheckEmailAvailable = () => {
    return useMutation({
        mutationFn: (data) => checkEmailAvailable(data)
    });
}

const sendOtp = async (data) => {
    const { email } = data;
    const response = await APIClient.post("/auth/send-verify-email", {
        email
    });
    return response.data;
}

const useSendOtp = () => {
    return useMutation({
        mutationFn: (data) => sendOtp(data)
    });
}

const register = async (data) => {
    const { username, fullname, password, email, otp } = data;
    const response = await APIClient.post("/auth/register", {
        username,
        fullname,
        password,
        email,
        otp
    });
    return response.data;
}

const useRegister = () => {
    return useMutation({
        mutationFn: (data) => register(data)
    });
}

const changeUsername = async (data) => {
    const { username, password } = data;
    const response = await APIClient.put("/auth/change-username", {
        username,
        password
    });
    return response.data;
}

const useChangeUsername = () => {
    return useMutation({
        mutationFn: (data) => changeUsername(data)
    });
}

const changePassword = async (data) => {
    const { oldPassword, newPassword } = data;
    const response = await APIClient.put("/auth/change-password", {
        oldPassword,
        newPassword
    });
    return response.data;
}

const useChangePassword = () => {
    return useMutation({
        mutationFn: (data) => changePassword(data)
    });
}

const changeEmail = async (data) => {
	const { email, otp } = data;
	const response = await APIClient.put("/auth/change-email", {
		email,
        otp
	});
	return response.data;
}

const useChangeEmail = () => {
	return useMutation({
		mutationFn: (data) => changeEmail(data)
	});
}

const forgotUsername = async (data) => {
	const { email } = data;
	const response = await APIClient.post("/auth/forgot-username", {
		email
	});
	return response.data;
}

const useForgotUsername = () => {
	return useMutation({
		mutationFn: (data) => forgotUsername(data)
	});
}

const forgotPassword = async (data) => {
    const { email, username } = data;
    const response = await APIClient.post("/auth/forgot-password", {
        email, username
    });
    return response.data;
}

const useForgotPassword = () => {
    return useMutation({
        mutationFn: (data) => forgotPassword(data)
    });
}

const resetPassword = async (data) => {
    const { email, password, confirmPassword, otp } = data;
    const response = await APIClient.post("/auth/reset-password", {
        email, password, confirmPassword, otp
    });
    return response.data;
}

const useResetPassword = () => {
    return useMutation({
        mutationFn: (data) => resetPassword(data)
    });
}

export { 
    useLogin, 
    useCheckUsernameAvailable,
    useCheckEmailAvailable,
    useSendOtp,
    useRegister,
    useChangeUsername,
    useChangePassword,
    useChangeEmail,
    useForgotUsername,
    useForgotPassword,
    useResetPassword
};
