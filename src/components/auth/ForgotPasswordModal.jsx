import { useEffect, useState } from "react";
import { emailRegex } from "../../constants";
import { Check, Eye, EyeOff, Lock, LockKeyhole, Mail, Shield, User, X } from "lucide-react";
import ForgotUsernameButton from "./ForgotUsernameButton";
import SendResetPasswordOtpButton from "./SendResetPasswordOtpButton";
import { toast } from "react-toastify";
import { useResetPassword } from "../../api/auth";

const ForgotPasswordModal = ({ show, close }) => {
    if (!show) return null;

    const [showPassword, setShowPassword] = useState("password");
    const [showConfirmPassword, setShowConfirmPassword] = useState("password");

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const isValidEmail = emailRegex.test(email);

    const password8Char = password.length >= 8;
    const passwordIncludeUsername = password.toLowerCase().includes(username.toLowerCase());
    const isValidPassword = password8Char && !passwordIncludeUsername;

    const resetPasswordDisable = !isValidEmail || !username || !password ||
        !isValidPassword || (password != confirmPassword) || otp.length != 6;

    const { mutate, isLoading, isError, error, isSuccess, data } = useResetPassword();

    const handleResetPassword = () => {
        mutate({ email, password, confirmPassword, otp });
    };
    useEffect(() => {
        if (data) {
            toast.success(data?.message);
            close();
        }
    }, [isSuccess]);

    useEffect(() => {
        const errorMessage = error?.response?.data?.message;
        toast.error(errorMessage);
    }, [isError]);

    return (
        <div className="fixed z-9999 inset-0 flex justify-center
            bg-black bg-opacity-75 backdrop-blur-sm overflow-auto py-2"
        >
            <div className="w-[500px] h-fit relative bg-white dark:bg-boxdark p-5 rounded-lg">
                <div className="flex justify-center mb-6">
                    <div className="text-xl font-bold">Forgot Password</div>
                    <button
                        className="text-xl place-self-end absolute top-2 right-2 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded"
                        onClick={close}
                    >
                        <X />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <div className="mb-1">Email</div>
                        <div className="text-black w-full">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-black dark:text-bodydark">
                                    <Mail />
                                </span>
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-3 bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        text-black dark:text-white"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Please enter the email you used to create your account"
                                />
                            </div>
                        </div>
                        <div className="text-red-500 mt-1 text-sm h-auto w-auto">
                            {(!isValidEmail && email != "") ? "*Please enter a valid email." : ""}
                        </div>
                    </div>
                    <div>
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
                        <div className="mt-1 flex justify-end">
                            <ForgotUsernameButton email={email} />
                        </div>
                    </div>
                    <div>
                        <div className="mb-1">New Password</div>
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
                                    {showPassword === "password" && (<Eye />)}
                                    {showPassword === "text" && (<EyeOff />)}
                                </button>
                            </div>
                        </div>
                        <div className="text-red-500 mt-1 text-sm">
                            {(!isValidPassword && password != "") ? "*Please meet all the requirements." : ""}
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
                                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-black dark:text-bodydark">
                                    <Lock />
                                </span>
                                <input
                                    type={showConfirmPassword}
                                    className="w-full bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        pr-16 pl-10 text-black dark:text-white"
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
                            {(confirmPassword != password) && confirmPassword ? "*Passwords do not match. Please try again" : ""}
                        </div>
                    </div>
                    <div>
                        <div className="mb-1">
                            Click the Send OTP button and we will send an OTP to your email to ensure the above email address is yours.
                        </div>
                        <div className="text-black w-full flex gap-2 items-center">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-black dark:text-bodydark">
                                    <Shield />
                                </span>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="Enter OTP in email"
                                    className="w-full pl-10 pr-3 bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        text-black dark:text-white"
                                    value={otp}
                                    onChange={e => {
                                        const inputValue = e.target.value;
                                        if (/^\d*$/.test(inputValue)) {
                                            setOtp(inputValue);
                                        }
                                    }}
                                />
                            </div>
                            <SendResetPasswordOtpButton
                                email={email}
                                isValidEmail={isValidEmail}
                                username={username}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        className={`bg-purple-700 dark:bg-purple-500 text-white 
                                font-bold w-full py-1 rounded-lg hover:bg-purple-800 dark:hover:bg-purple-600
                                ${resetPasswordDisable ? "pointer-events-none opacity-50" : ""}`}
                        onClick={handleResetPassword}
                    >
                        {isLoading ? "On working..." : "Reset Password"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordModal;
