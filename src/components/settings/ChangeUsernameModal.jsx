import { User, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { fakeStreamer } from "../../constants/index"

const ChangeUsernameModal = ({ show, onClose }) => {
    if (!show) return null;

    const user = fakeStreamer;

    const [showPassword, setShowPassword] = useState("password");

    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState("");

    const isAvailableUsername = true;
    const isValidUsername = username.length >= 4 && username.length <= 25;
    const isCorrectPassword = false;

    const changeUsernameDisabled = username == "" || password == "" || username == user.username;
        !isValidUsername || !isAvailableUsername;

    return (
        <div className="fixed z-9999 inset-0 flex justify-center items-center
            bg-black bg-opacity-75 backdrop-blur-sm"
        >
            <div className="w-[500px] relative bg-white dark:bg-boxdark p-5 rounded-lg space-y-8">
                <div>
                    <div className="text-xl font-bold">Change Username</div>
                    <button
                        className="text-xl place-self-end absolute top-2 right-2
                            hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded"
                        onClick={onClose}
                    >
                        <X />
                    </button>
                </div>
                <div className="space-y-6">
                    <div>
                    <div className="mb-1">New Username</div>
                        <div id="usernameInput" className="text-black w-full">
                            <div className="relative">
                                {/* <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-black dark:text-bodydark">
                                    <User />
                                </span> */}
                                <input 
                                    type="text" 
                                    className="w-full px-4 bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        text-black dark:text-white"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="text-red-500 mt-1 text-sm">
                            {!isAvailableUsername && isValidUsername ? "*This username is unavailable." : ""}
                            {!isValidUsername && username != "" ? "*Username must be between 4 and 25 characters." : ""}
                        </div>
                    </div>
                    <div>
                        <div className="mb-1">Password</div>
                        <div className="text-black w-full">
                            <div className="relative">
                                <input
                                    type={showPassword}
                                    className="w-full bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        pr-16 pl-4 text-black dark:text-white"
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
                        <div className="text-red-500 mt-1 text-sm">
                            {!isCorrectPassword ? "*Incorrect password." : ""}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-2 py-1 rounded-md
                            bg-slate-300 dark:bg-slate-700
                            hover:bg-slate-400 dark:hover:bg-slate-600"
                        onClick={onClose}
                    >Cancel</button>
                    <button
                        className={`px-2 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700
                            ${changeUsernameDisabled ? "pointer-events-none opacity-50" : ""}`}
                        onClick={() => {
                            onClose();
                        }}
                    >Change Username</button>
                </div>
            </div>
        </div>
    );
}

export default ChangeUsernameModal;
