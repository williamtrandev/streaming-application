import { useState, useEffect, useRef } from "react";
import { X, User, LockKeyhole, Eye, EyeOff, CircleAlert } from "lucide-react";
import { appName } from "../../constants";
import { toast } from "react-toastify";
import { useLogin } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Modal } from "antd";

const LoginModal = ({ isVisible, onClose, openRegisterModal, openForgotPasswordModal }) => {
    if (!isVisible) return null;
    const passwordRef = useRef(null);

    const [showPassword, setShowPassword] = useState("password");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginDisabled = username === "" || password === "";
    const { mutate, isPending, isError, error, isSuccess, data } = useLogin();
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
            toast.success("Login Successfully", {
                position: "bottom-right"
            });
            login(data);
            onClose();
            setUsername("");
            setPassword("");
        }
    }, [isSuccess]);

    useEffect(() => {
        const statusCode = error?.response?.status;
        const errorMessage = error?.response?.data?.message;
        if (statusCode === 401) {
            toast.error(errorMessage);
        }
    }, [isError]);

    return (
        <Modal
            open={isVisible}
            onCancel={onClose}
            closeIcon={<X className="dark:text-slate-200" />}
            className="bg-slate-100 dark:bg-slate-800 rounded-lg dark:text-slate-200 pb-0"
            footer={null}
        >
            <div>
                <div className="flex justify-center mb-6">
                    <div className="text-xl font-bold">Log in to {appName}</div>
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
                    <div>
                        <button
                            className="text-purple-700 dark:text-purple-500 w-full py-1 hover:text-black dark:hover:text-white
                                hover:bg-neutral-300 dark:hover:bg-purple-600 rounded-lg"
                            onClick={() => {
                                onClose();
                                openRegisterModal();
                            }}
                        >Don't have an account? Sign up</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default LoginModal;
