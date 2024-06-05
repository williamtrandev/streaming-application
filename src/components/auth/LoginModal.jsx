import { useState, useEffect } from "react";
import { X, User, LockKeyhole, Eye, EyeOff, CircleAlert } from "lucide-react";
import { toast } from "react-toastify";
import { useLogin } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";

const LoginModal = ({ isVisible, onClose, openRegisterModal }) => {
    if (!isVisible) return null;

    const [showPassword, setShowPassword] = useState("password");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginDisabled = username === "" || password === "";
    const { mutate, isLoading, isError, error, isSuccess, data } = useLogin();
    const { login } = useAuth();

    const handleSubmitLogin = () => {
        mutate({ username, password });
    };
    useEffect(() => {
        if(data) {
            toast.success("Login Successfully", {
                position: "bottom-right"
            });
            login(data);
            onClose(false);
        }
    }, [isSuccess]);

    useEffect(() => {
        const statusCode = error?.response?.status;
        const errorMessage = error?.response?.data?.error;
        if (statusCode === 401) {
            toast.error(errorMessage);
        }
    }, [isError]);

    return (
        <div className="fixed z-9999 inset-0 flex justify-center items-center bg-black bg-opacity-75 backdrop-blur-sm">
            <div className="w-[500px] relative bg-white dark:bg-boxdark p-5 rounded-lg">
                <div className="flex justify-center mb-6">
                    <div className="text-xl font-bold">Log in to Will Streaming</div>
                    <button
                        className="text-xl place-self-end absolute top-2 right-2 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded"
                        onClick={() => onClose(false)}
                    >
                        <X />
                    </button>
                </div>
                <div>
                    <div className="mb-4">
                        <div className="mb-1">Username</div>
                        <div id="usernameInput" className="text-black w-full">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center fill-current">
                                    <User />
                                </span>
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 
                                        focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                                        transition duration-150 ease-in-out"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">Password</div>
                        <div id="passwordInput" className="text-black w-full">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <LockKeyhole />
                                </span>
                                <input
                                    type={showPassword}
                                    className="w-full pl-10 pr-13 py-2 rounded-lg border border-gray-300 
                                        focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                                        transition duration-150 ease-in-out"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button
                                    className="absolute inset-y-0 right-0 px-3 flex items-center rounded-r-lg hover:bg-neutral-300"
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
                            className="text-sm text-blue-700 dark:text-blue-500 hover:underline"
                        >Forgot your password?</button>
                    </div>
                    <div className="mb-3">
                        <button disabled={loginDisabled}
                            className={`bg-blue-700 dark:bg-blue-500 text-white 
                                font-bold w-full py-1 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700
                                ${loginDisabled ? "pointer-events-none opacity-50" : ""}`}
                            onClick={handleSubmitLogin}
                        >
                            {isLoading ? "Logging in..." : "Log In"}
                        </button>
                    </div>
                    <div>
                        <button
                            className="text-blue-700 dark:text-blue-500 w-full py-1 hover:text-black dark:hover:text-white
                                hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg"
                            onClick={() => {
                                onClose(false);
                                openRegisterModal(true);
                            }}
                        >Don't have an account? Sign up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;
