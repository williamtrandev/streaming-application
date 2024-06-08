import { Eye, EyeOff, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { ModalContext } from "../../contexts/ModalContext";
import NewUsernameInput from "./NewUsernameInput";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { useChangeUsername } from "../../api/auth";
import { useUser } from "../../contexts/UserContext";

const ChangeUsernameModal = ({ show, onClose }) => {
    if (!show) return null;

    const { authUsername, setAuthUsername } = useUser();
    const [showPassword, setShowPassword] = useState("password");

    const [username, setUsername] = useState(authUsername);
    const [password, setPassword] = useState("");

    const [isValidUsername, setIsValidUsername] = useState(false) ;

    const changeUsernameDisabled = username == "" || password == "" || username == authUsername;
        !isValidUsername;

        const { auth } = useAuth();
        const token = auth?.accessToken;
        const { mutate, isLoading, isError, error, isSuccess, data } = useChangeUsername();
    
        const handleSave = async () => {
            mutate({ token, username, password });
        };
    
        useEffect(() => {
            if(data) {
                toast.success("Change username successfully");
                setAuthUsername(data.newUsername);
                onClose();
            }
        }, [isSuccess]);
    
        useEffect(() => {
            const statusCode = error?.response?.status;
            const errorMessage = error?.response?.data?.message;
            if (statusCode === 400) {
                toast.error(errorMessage);
            }
        }, [isError]);

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
                    <NewUsernameInput 
                        value={username}
                        setUsername={setUsername}
                        setIsValid={setIsValidUsername}
                    />
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
                            ${changeUsernameDisabled || isLoading ? "pointer-events-none opacity-50" : ""}`}
                        onClick={handleSave}
                    >
                        {isLoading ? "Saving..." : "Change Username" }
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangeUsernameModal;
