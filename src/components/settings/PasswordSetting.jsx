import { Modal } from "antd";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useChangePassword } from "../../api/auth";
import { useUser } from "../../contexts/UserContext";

const PasswordSetting = () => {
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const { authUsername } = useUser();

    const [showOldPassword, setShowOldPassword] = useState("password");
    const [showNewPassword, setShowNewPassword] = useState("password");
    const [showConfirmPassword, setShowConfirmPassword] = useState("password");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const password8Char = newPassword.length >= 8;
    const passwordIncludeUsername = newPassword.toLowerCase().includes(authUsername.toLowerCase());
    const isValidPassword = password8Char && !passwordIncludeUsername;

    const isConfirmPasswordMatch = confirmPassword === newPassword;

    const changePasswordDisabled = oldPassword == "" || newPassword == "" || confirmPassword == "" ||
        !isValidPassword || !isConfirmPasswordMatch;

    const { mutate, isPending, isError, error, isSuccess, data } = useChangePassword();

    const handleSubmit = async () => {
        mutate({ oldPassword, newPassword });
    };

    useEffect(() => {
        if (data) {
            toast.success("Change password successfully");
            setShowChangePasswordModal(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    }, [isSuccess]);

    useEffect(() => {
        const errorMessage = error?.response?.data?.message;
        toast.error(errorMessage);
    }, [isError]);

    return (
        <div className="flex w-full gap-4 py-4 md:py-6">
            <div className="w-[30%]">Password</div>
            <div className="space-y-2 w-full">
                <button
                    className="px-2 py-1 rounded-lg text-white
                                bg-purple-600 hover:bg-purple-700"
                    onClick={() => setShowChangePasswordModal(true)}
                >Change password</button>
                <p>Improve your security with a strong password.</p>
            </div>
            <Modal
                open={showChangePasswordModal}
                onCancel={() => setShowChangePasswordModal(false)}
                okText={"Change password"}
                onOk={handleSubmit}
                confirmLoading={isPending}
                closeIcon={<X className="dark:text-slate-200" />}
                okButtonProps={{ className: 'bg-purple-600 hover:!bg-purple-700', disabled: changePasswordDisabled }}
                cancelButtonProps={{ className: 'border-purple-600 hover:!border-purple-700 hover:!text-purple-700' }}
                className="bg-slate-100 dark:bg-slate-800 rounded-lg dark:text-slate-200 pb-0"
            >
                <div className="space-y-8">
                    <div>
                        <div className="text-xl font-bold">Change Password</div>
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
                            <div className="mb-1">Confirm New Password</div>
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
                </div>
            </Modal>
        </div>
    );
}

export default PasswordSetting;
