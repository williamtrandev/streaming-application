import { useRef, useState, useEffect } from "react";
import { X, LockKeyhole, Eye, EyeOff, Check, SquareUser, Shield } from "lucide-react";
import { appName } from "../../constants";
import { toast } from "react-toastify";
import UsernameInput from "./UsernameInput";
import EmailInput from "./EmailInput";
import SendOtpButton from "./SendOtpButton";
import { useRegister } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";

const RegisterModal = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    const [showPassword, setShowPassword] = useState("password");
    const [username, setUsername] = useState("");
    const [fullname, setFullName] = useState("");
    const [password, setPassword] = useState("");
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
        otp.length != 6;

    const { mutate, isLoading, isError, error, isSuccess, data } = useRegister();
    const { login } = useAuth();

    const handleSubmitLogin = () => {
        mutate({ username, fullname, password, email, otp });
    };
    useEffect(() => {
        if(data) {
            toast.success("Register Successfully");
            login(data);
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
        <div className="fixed z-9999 inset-0 flex justify-center
            bg-black bg-opacity-75 backdrop-blur-sm overflow-auto py-2"
        >
            <div className="w-[500px] h-fit relative bg-white dark:bg-boxdark p-5 rounded-lg">
                <div className="flex justify-center mb-6">
                    <div className="text-xl font-bold">Join {appName} today</div>
                    <button
                        className="text-xl place-self-end absolute top-2 right-2
                            hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded"
                        onClick={() => onClose()}
                    ><X /></button>
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
                                        text-black dark:text-white"
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
                        <div id="usernameInput" className="text-black w-full flex gap-2 items-center">
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
                            <SendOtpButton 
                                email={email}
                                isValidEmail={isValidEmail}
                            />
                        </div>
                    </div>
                    {/* <div className="mb-3 text-sm">
                        By clicking Sign Up, you are agreeing to our <button className="text-blue-700 dark:text-blue-500 hover:underline">Terms of Service</button> and are acknowledging our <button className="text-blue-700 dark:text-blue-500 hover:underline">Privacy Notice</button> applies.
                    </div> */}
                    <div className="mb-3">
                        <button
                            className={`bg-purple-700 text-white 
                                font-bold w-full py-1 rounded-lg hover:bg-purple-800
                                ${signupDisabled ? "pointer-events-none opacity-50" : ""}`}
                            onClick={handleSubmitLogin}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterModal
