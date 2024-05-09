import { useEffect, useState } from "react";
import { X, User, LockKeyhole, Eye, EyeOff, Check, CircleAlert, Mail } from "lucide-react";

const RegisterModal = ({ isVisible, onClose }) => {
    if (!isVisible) return null;
    
    const [showPassword, setShowPassword] = useState("password");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const isValidUsername = username.length >= 4 && username.length <= 40;

    const password8Char = password.length >= 8;
    const passwordIncludeUsername = password.includes(username);
    const isValidPassword = password8Char && !passwordIncludeUsername;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);

    const signupDisabled = username == "" || !isValidUsername ||
        password == "" || !isValidPassword ||
        email == "" || !isValidEmail;

    return (
        <div className="fixed z-9999 inset-0 flex justify-center
        bg-black bg-opacity-75 backdrop-blur-sm overflow-auto py-2">
            <div className="w-[500px] h-fit relative bg-white dark:bg-boxdark p-5 rounded">
                <div className="flex justify-center mb-6">
                    <div className="text-xl font-bold">Join Will Streaming today</div>
                    <button
                        className="text-xl place-self-end absolute top-2 right-2
                            hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded"
                        onClick={() => onClose(false)}
                    ><X /></button>
                </div>
                <div>
                    <div className="mb-4">
                        <div className="mb-1">Username</div>
                        <div id="usernameInput" className="text-black w-full">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <User />
                                </span>
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 
                                        focus:outline-none focus:border-indigo-500 
                                        focus:ring focus:ring-indigo-200 
                                        transition duration-150 ease-in-out"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="text-red-500 mt-1 text-sm">
                            {!isValidUsername && username != "" ? "*Usernames must be between 4 and 40 characters." : ""}
                        </div>
                        <div className="mt-1 text-sm">
                            {username == "" ? "This is the name people will know you by on Will Streaming. You can always change it later." : ""}
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
                        <div className="mb-1">Email</div>
                        <div id="usernameInput" className="text-black w-full">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <Mail />
                                </span>
                                <input 
                                    type="text"
                                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 
                                        focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                                        transition duration-150 ease-in-out"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="
                            text-red-500 mt-1 text-sm h-auto w-auto">
                            {(!isValidEmail && email != "") ? "*Please enter a valid email." : ""}
                        </div>
                    </div>
                    <div className="mb-5 text-red-500 p-1 border-red-500 border-2 rounded-lg flex">
                        <span className="mr-1">
                            <CircleAlert />
                        </span>
                        Error goes here
                    </div>
                    <div className="mb-3 text-sm">
                        By clicking Sign Up, you are agreeing to our <button className="text-blue-700 dark:text-blue-500 hover:underline">Terms of Service</button> and are acknowledging our <button className="text-blue-700 dark:text-blue-500 hover:underline">Privacy Notice</button> applies.
                    </div>
                    <div className="mb-3">
                        <button disabled={signupDisabled}
                            className={`bg-blue-700 dark:bg-blue-500 text-white 
                                font-bold w-full py-1 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700
                                ${signupDisabled ? "pointer-events-none opacity-50" : ""}`}
                        >Sign up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterModal
