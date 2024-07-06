import { useRef, useState, useEffect } from "react";
import { X, LockKeyhole, Eye, EyeOff, Check, SquareUser, Shield } from "lucide-react";
import { appName } from "../../constants";
import { toast } from "react-toastify";
import UsernameInput from "./UsernameInput";
import EmailInput from "./EmailInput";
import SendOtpButton from "./SendOtpButton";
import { useRegister } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Modal } from "antd";

const RegisterModal = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    const [showPassword, setShowPassword] = useState("password");
    const [showConfirmPassword, setShowConfirmPassword] = useState("password");

    const [username, setUsername] = useState("");
    const [fullname, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const [isValidUsername, setIsValidUsername] = useState(false);

    const isValidName = fullname.length >= 4 && fullname.length <= 40;

    const password8Char = password.length >= 8;
    const passwordIncludeUsername = password.toLowerCase().includes(username.toLowerCase());
    const isValidPassword = password8Char && !passwordIncludeUsername;

    const [isValidEmail, setIsValidEmail] = useState(false);

    const signupDisabled = username == "" || !isValidUsername ||
        fullname == "" || !isValidName ||
        password == "" || !isValidPassword ||
        email == "" || !isValidEmail ||
        otp.length != 6 || (password != confirmPassword);

    const { mutate, isPending, isError, error, isSuccess, data } = useRegister();
    const { login } = useAuth();

    const handleSubmitLogin = () => {
        mutate({ username, fullname, password, email, otp });
    };
    useEffect(() => {
        if (data) {
            toast.success("Register Successfully");
            login(data);
            onClose();
            setUsername("");
            setFullName("");
            setPassword("");
            setEmail("");
            setOtp("");
            setConfirmPassword("");
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
        <Modal
            open={isVisible}
            onCancel={onClose}
            closeIcon={<X className="dark:text-slate-200" />}
            className="bg-slate-100 dark:bg-slate-800 rounded-lg dark:text-slate-200 pb-0"
            footer={null}
            centered
        >
            <div>
                <div className="flex justify-center mb-6">
                    <div className="text-xl font-bold">Join {appName} today</div>
                </div>
                <div>
                    <div className="mb-4">
                        <UsernameInput
                            value={username}
                            setUsername={setUsername}
                            setIsValid={setIsValidUsername}
                        />
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">Display name</div>
                        <div id="usernameInput" className="text-black w-full">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-black dark:text-bodydark">
                                    <SquareUser />
                                </span>
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-3 bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        text-black dark:text-white outline-purple-600"
                                    value={fullname}
                                    onChange={e => setFullName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="text-red-500 mt-1 text-sm">
                            {!isValidName && fullname != "" ? "*Display name must be between 4 and 40 characters." : ""}
                        </div>
                        <div className="mt-1 text-sm">
                            {fullname == "" ? `This is the name people will know you by on ${appName}. You can always change it later.` : ""}
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
                    <div className="mb-4">
                        <div className="mb-1">Confirm Password</div>
                        <div className="text-black w-full">
                            <div className="relative">
                                <input
                                    type={showConfirmPassword}
                                    className="w-full bg-[#edf2f9] shadow-md dark:bg-meta-4 py-2 rounded-lg 
                                        pr-16 pl-4 text-black dark:text-white outline-purple-600"
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
                            {(password != confirmPassword) && confirmPassword != "" ? "*Passwords do not match. Please try again" : ""}
                        </div>
                    </div>
                    <div className="mb-4">
                        <EmailInput
                            value={email}
                            setEmail={setEmail}
                            setIsValid={setIsValidEmail}
                        />
                    </div>
                    <div className="mb-8">
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
                                        text-black dark:text-white outline-purple-600"
                                    value={otp}
                                    onChange={e => {
                                        const inputValue = e.target.value;
                                        if (/^\d*$/.test(inputValue)) {
                                            setOtp(inputValue);
                                        }
                                    }}
                                />
                            </div>
                            <SendOtpButton
                                email={email}
                                isValidEmail={isValidEmail}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <Button
                            type="primary"
                            className="w-full bg-purple-600 hover:!bg-purple-700 border-none"
                            disabled={signupDisabled}
                            onClick={handleSubmitLogin}
                            loading={isPending}
                        >
                            {isPending ? "Signing up..." : "Sign Up"}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default RegisterModal;
