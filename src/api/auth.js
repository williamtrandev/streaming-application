import APIClient from "../utils/APIClient";
import { useMutation } from "@tanstack/react-query";

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
    })
}

export { useLogin };
