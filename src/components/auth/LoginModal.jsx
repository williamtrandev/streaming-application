import { useEffect, useState } from "react";
import { X, User, LockKeyhole, Eye, EyeOff, CircleAlert } from "lucide-react";
import { appName } from "../../constants";

const LoginModal = ({ isVisible, onClose, openRegisterModal }) => {
    if (!isVisible) return null;
    const [showPassword, setShowPassword] = useState("password");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginDisabled = username == "" || password == "";

    return (
        <div className="fixed z-9999 inset-0 flex justify-center items-center
            bg-black bg-opacity-75 backdrop-blur-sm"
        >
            <div className="w-[500px] relative bg-white dark:bg-boxdark p-5 rounded-lg">
                <div className="flex justify-center mb-6">
                    <div className="text-xl font-bold">Log in to {appName}</div>
                    <button
                        className="text-xl place-self-end absolute top-2 right-2
                            hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded"
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
                                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-black dark:text-bodydark">
                                    <User />
                                </span>
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-3 bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        text-black dark:text-white"
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
                                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-black dark:text-bodydark">
                                    <LockKeyhole />
                                </span>
                                <input 
                                    type={showPassword} 
                                    className="w-full pl-10 pr-16 bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        text-black dark:text-white" 
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}    
                                />
                                <button 
                                    className="absolute inset-y-0 right-0 px-3 flex items-center rounded-r-lg
                                        text-black dark:text-bodydark hover:bg-slate-300 dark:hover:bg-slate-600"
                                    onClick={() => {
                                        setShowPassword(showPassword === "password" ? "text" : "password");
                                    }}
                                >
                                    {showPassword == "password" && (<Eye />)}
                                    {showPassword == "text" && (<EyeOff />)}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <button 
                            className="text-sm text-blue-700 dark:text-blue-500 hover:underline"
                        >Forgot your password?</button>
                    </div>
                    <div className="mb-5 text-red-500 px-4 py-2 border-red-500 border-2 rounded-lg flex">
                        <span className="mr-1">
                            <CircleAlert />
                        </span>
                        Username or password was incorrect.
                    </div>
                    <div className="mb-3">
                        <button disabled={loginDisabled}
                            className={`bg-blue-700 dark:bg-blue-500 text-white 
                                font-bold w-full py-1 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700
                                ${loginDisabled ? "pointer-events-none opacity-50" : ""}`}
                        >Log In</button>
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

export default LoginModal
