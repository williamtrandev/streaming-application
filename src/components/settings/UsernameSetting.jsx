import { Modal } from "antd";
import { Eye, EyeOff, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useChangeUsername } from "../../api/auth";
import { toast } from "react-toastify";
import NewUsernameInput from "./NewUsernameInput";
import { useUser } from "../../contexts/UserContext";

const UsernameSetting = ({ canChangeUsername }) => {
    const { authUsername, setAuthUsername } = useUser();
    const [showChangeUsernameModal, setShowChangeUsernameModal] = useState(false);
    const [savedNewUsername, setSavedNewUsername] = useState(false);

    const [showPassword, setShowPassword] = useState("password");

    const [username, setUsername] = useState(authUsername);
    const [password, setPassword] = useState("");

    const [isValidUsername, setIsValidUsername] = useState(false);

    const changeUsernameDisabled = username == "" || password == "" || username == authUsername;
    !isValidUsername;

    const { mutate, isPending, isError, error, isSuccess, data } = useChangeUsername();

    const handleSave = async () => {
        mutate({ username, password });
    };

    useEffect(() => {
        if (data) {
            toast.success("Change username successfully");
            setAuthUsername(data.newUsername);
            setShowChangeUsernameModal(false);
            setSavedNewUsername(true);
        }
    }, [isSuccess]);

    useEffect(() => {
        const errorMessage = error?.response?.data?.message;
        toast.error(errorMessage);
    }, [isError]);

    return (
        <div className="flex justify-between w-full gap-4 items-start py-4">
            <div className="w-[35%] font-bold">Username</div>
            <div className="w-full space-y-2">
                <div className="relative">
                    <div
                        className="w-full px-3 py-1 dark:text-white rounded-lg bg-slate-300 dark:bg-slate-700"
                    >
                        {authUsername}
                    </div>
                    {canChangeUsername && !savedNewUsername && <button
                        className="absolute right-0 top-0 h-full p-2 rounded-r-lg dark:text-white 
                        hover:bg-gray-500"
                        onClick={() => {
                            setShowChangeUsernameModal(true);
                        }}
                    >
                        <Pencil size={16} />
                    </button>}
                    {/* <button
                        className="absolute right-0 top-0 h-full p-2 rounded-r-lg dark:text-white 
                                hover:bg-gray-500"
                        onClick={() => {
                            setShowChangeUsernameModal(true);
                        }}
                    >
                        <Pencil size={16} />
                    </button> */}
                </div>
                <p>You can only change your username every 14 days</p>
            </div>
            <Modal
                open={showChangeUsernameModal}
                onCancel={() => setShowChangeUsernameModal(false)}
                onOk={handleSave}
                confirmLoading={isPending}
                closeIcon={<X className="dark:text-slate-200" />}
                okText={"Change username"}
                okButtonProps={{ className: 'bg-purple-600 hover:!bg-purple-700', disabled: changeUsernameDisabled }}
                cancelButtonProps={{ className: 'border-purple-600 hover:!border-purple-700 hover:!text-purple-700' }}
                className="bg-slate-100 dark:bg-slate-800 rounded-lg dark:text-slate-200 pb-0"
            >
                <div className="space-y-8">
                    <div>
                        <div className="text-xl font-bold">Change Username</div>
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
                    {/* <div className="flex justify-end gap-2">
                        <button
                            className="px-2 py-1 rounded-md
                            bg-slate-300 dark:bg-slate-700
                            hover:bg-slate-400 dark:hover:bg-slate-600"
                            onClick={onClose}
                        >Cancel</button>
                        <button
                            className={`px-2 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700
                            ${changeUsernameDisabled || isPending ? "pointer-events-none opacity-50" : ""}`}
                            onClick={handleSave}
                        >
                            {isPending ? "Saving..." : "Change Username"}
                        </button>
                    </div> */}
                </div>
            </Modal>
        </div>
    );
}

export default UsernameSetting;
