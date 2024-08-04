import React from 'react'
import { useState, useEffect, useRef } from "react";
import { User, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { appName } from "../../constants";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "antd";
import { useAdminLogin } from '../../api/admin';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const passwordRef = useRef(null);

    const [showPassword, setShowPassword] = useState("password");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginDisabled = username === "" || password === "";
    const { mutate, isPending, isError, error, isSuccess, data } = useAdminLogin();
    const { login } = useAuth();

    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter') {
            nextRef.current.focus();
        }
    };

    const handleSubmitLogin = () => {
        mutate({ username, password });
    };

    const handleKeyDownSubmit = (e) => {
        if (e.key === 'Enter' && !loginDisabled) {
            handleSubmitLogin();
        }
    };

    useEffect(() => {
        if (data) {
            toast.success("Admin Login Successfully", {
                position: "bottom-right"
            });
            login(data);
            navigate("/admin/streams");
        }
    }, [isSuccess]);

    useEffect(() => {
        const statusCode = error?.response?.status;
        const errorMessage = error?.response?.data?.message;
        if (statusCode === 401) {
            toast.error(errorMessage);
        }
    }, [isError]);

    useEffect(() => {
        document.title = "Admin - Login";
    }, []);

    return (
        <div className="dark:bg-boxdark-2 dark:text-bodydark bg-[#edf2f9]">
            <div className="flex h-screen overflow-hidden">
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 flex flex-col justify-center items-center">
                            <div className="w-[500px]">
                                <div className="flex justify-center mb-6">
                                    <div className="text-xl font-bold">Log in to {appName} Administration</div>
                                </div>
                                <div>
                                    <div className="mb-4">
                                        <div className="mb-1">Username</div>
                                        <div id="usernameInput" className="text-black w-full">
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-black dark:text-bodydark">
                                                    <User />
                                                </span>
                                                <input
                                                    type="text"
                                                    className="w-full pl-10 pr-3 bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        text-black dark:text-white outline-purple-600"
                                                    value={username}
                                                    onChange={e => setUsername(e.target.value)}
                                                    onKeyDown={e => handleKeyDown(e, passwordRef)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <div className="mb-1">Password</div>
                                        <div id="passwordInput" className="text-black w-full">
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-black dark:text-bodydark">
                                                    <LockKeyhole />
                                                </span>
                                                <input
                                                    type={showPassword}
                                                    className="w-full pl-10 pr-16 bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        text-black dark:text-white outline-purple-600"
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    ref={passwordRef}
                                                    onKeyDown={e => handleKeyDownSubmit(e)}
                                                />
                                                <button
                                                    className="absolute inset-y-0 right-0 px-3 flex items-center rounded-r-lg
                                        text-black dark:text-bodydark hover:bg-slate-300 dark:hover:bg-slate-600"
                                                    onClick={() => {
                                                        setShowPassword(showPassword === "password" ? "text" : "password");
                                                    }}
                                                >
                                                    {showPassword === "password" && (<Eye />)}
                                                    {showPassword === "text" && (<EyeOff />)}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <button
                                            className="text-sm text-purple-700 dark:text-purple-500 hover:underline"
                                            onClick={() => {
                                                onClose();
                                                openForgotPasswordModal();
                                            }}
                                        >Forgot your password?</button>
                                    </div>
                                    <div className="mb-3">
                                        <Button
                                            type="primary"
                                            disabled={loginDisabled}
                                            className="w-full bg-purple-600 hover:!bg-purple-700 border-none"
                                            onClick={handleSubmitLogin}
                                            loading={isPending}
                                        >
                                            {isPending ? "Logging in..." : "Log in"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
