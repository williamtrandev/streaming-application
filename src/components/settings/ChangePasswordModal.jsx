import { Check, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { fakeStreamer } from "../../constants/index"

const ChangePasswordModal = ({ show, onClose }) => {
    if (!show) return null;

    const { username } = fakeStreamer;

    const [showOldPassword, setShowOldPassword] = useState("password");
    const [showNewPassword, setShowNewPassword] = useState("password");
    const [showConfirmPassword, setShowConfirmPassword] = useState("password");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const password8Char = newPassword.length >= 8;
    const passwordIncludeUsername = newPassword.toLowerCase().includes(username.toLowerCase());
    const isValidPassword = password8Char && !passwordIncludeUsername;

    const isConfirmPasswordMatch = confirmPassword === newPassword;

    const isCorrectOldPassword = false;

    const changePasswordDisabled = oldPassword == "" || newPassword == "" || confirmPassword == "" ||
        !isValidPassword || !isConfirmPasswordMatch;

    return (
        <div className="fixed z-9999 inset-0 flex justify-center items-center
            bg-black bg-opacity-75 backdrop-blur-sm"
        >
            <div className="w-[500px] relative bg-white dark:bg-boxdark p-5 rounded-lg space-y-8">
                <div>
                    <div className="text-xl font-bold">Change Password</div>
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
                        <div className="mb-1">Old Password</div>
                        <div className="text-black w-full">
                            <div className="relative">
                                <input
                                    type={showOldPassword}
                                    className="w-full bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        pr-16 pl-4 text-black dark:text-white"
                                    value={oldPassword}
                                    onChange={e => setOldPassword(e.target.value)}
                                />
                                <button
                                    className="absolute inset-y-0 right-0 px-3 flex items-center rounded-r-lg
                                        text-black dark:text-bodydark hover:bg-slate-300 dark:hover:bg-slate-600"
                                    onClick={() => {
                                        setShowOldPassword(showOldPassword === "password" ? "text" : "password");
                                    }}
                                >
                                    {showOldPassword == "password" && (<Eye />)}
                                    {showOldPassword == "text" && (<EyeOff />)}
                                </button>
                            </div>
                        </div>
                        <div className="text-red-500 mt-1 text-sm">
                            {!isCorrectOldPassword ? "*Your current password was incorrect." : ""}
                        </div>
                    </div>
                    <div>
                        <div className="mb-1">New Password</div>
                        <div className="text-black w-full">
                            <div className="relative">
                                <input
                                    type={showNewPassword}
                                    className="w-full bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        pr-16 pl-4 text-black dark:text-white"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                                <button
                                    className="absolute inset-y-0 right-0 px-3 flex items-center rounded-r-lg
                                        text-black dark:text-bodydark hover:bg-slate-300 dark:hover:bg-slate-600"
                                    onClick={() => {
                                        setShowNewPassword(showNewPassword === "password" ? "text" : "password");
                                    }}
                                >
                                    {showNewPassword == "password" && (<Eye />)}
                                    {showNewPassword == "text" && (<EyeOff />)}
                                </button>
                            </div>
                        </div>
                        <div className="text-red-500 mt-1 text-sm">
                            {(!isValidPassword && newPassword != "") ? "*Please meet all the requirements." : ""}
                        </div>
                        <div className="text-sm">
                            <div className="flex items-center">
                                <span className="mr-1">
                                    {!password8Char && (<X size={16} className="text-red-500" />)}
                                    {password8Char && (<Check size={16} className="text-green-500" />)}
                                </span>
                                At least 8 characters.
                            </div>
                        </div>
                        <div className="text-sm">
                            <div className="flex items-center">
                                <span className="mr-1">
                                    {passwordIncludeUsername && (<X size={16} className="text-red-500" />)}
                                    {!passwordIncludeUsername && (<Check size={16} className="text-green-500" />)}
                                </span>
                                Cannot contain your username.
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="mb-1">Confirm Password</div>
                        <div className="text-black w-full">
                            <div className="relative">
                                <input
                                    type={showConfirmPassword}
                                    className="w-full bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        pr-16 pl-4 text-black dark:text-white"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    className="absolute inset-y-0 right-0 px-3 flex items-center rounded-r-lg
                                        text-black dark:text-bodydark hover:bg-slate-300 dark:hover:bg-slate-600"
                                    onClick={() => {
                                        setShowConfirmPassword(showConfirmPassword === "password" ? "text" : "password");
                                    }}
                                >
                                    {showConfirmPassword == "password" && (<Eye />)}
                                    {showConfirmPassword == "text" && (<EyeOff />)}
                                </button>
                            </div>
                        </div>
                        <div className="text-red-500 mt-1 text-sm">
                            {!isConfirmPasswordMatch && confirmPassword != "" ? "*Passwords do not match. Please try again" : ""}
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
                            ${changePasswordDisabled ? "pointer-events-none opacity-50" : ""}`}
                        onClick={() => {
                            
                        }}
                    >Change Password</button>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordModal;
