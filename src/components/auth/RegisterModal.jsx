import { useEffect, useState } from "react";

const RegisterModal = ({ isVisible, onClose }) => {
    if (!isVisible) return null;
    
    const [showPassword, setShowPassword] = useState("password");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const password8Char = password.length >= 8;
    const passwordIncludeUsername = password.includes(username);
    const isValidPassword = password8Char && !passwordIncludeUsername;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);

    const signupDisabled = username == "" || 
        password == "" || !isValidPassword ||
        email == "" || !isValidEmail;

    return (
        <div className="fixed z-9999 inset-0 flex justify-center items-center
        bg-black bg-opacity-75 backdrop-blur-sm">
            <div className="w-[500px] h-full relative bg-white dark:bg-boxdark p-5 rounded overflow-auto">
                <div className="flex justify-center mb-6">
                    <div className="text-xl font-bold">Join Will Stream today</div>
                    <button
                        className="text-xl place-self-end absolute top-2 right-2
                            hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded"
                        onClick={() => onClose(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            class="lucide lucide-x"
                        ><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>
                <div>
                    <div className="mb-4">
                        <div className="mb-1">Username</div>
                        <div id="usernameInput" className="text-black w-full">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </span>
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 
                                        focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                                        transition duration-150 ease-in-out"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="text-red-500 mt-1 text-sm">*This username is unavailable.</div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">Password</div>
                        <div id="passwordInput" className="text-black w-full">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-keyhole"><circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>
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
                                    {((showPassword == "password") && (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>))}
                                    {((showPassword == "text") && (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>))}
                                </button>
                            </div>
                        </div>
                        <div className="text-red-500 mt-1 text-sm">
                            {(!isValidPassword && password != "") ? "*Please meet all the requirements." : ""}
                        </div>
                        <div className="text-sm">
                            <div className="flex items-center">
                                <span className="mr-1">
                                    {!password8Char && (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x text-red-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>)}
                                    {password8Char && (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check text-green-500"><path d="M20 6 9 17l-5-5"/></svg>)}
                                </span>
                                At least 8 characters.
                            </div>
                        </div>
                        <div className="text-sm">
                            <div className="flex items-center">
                                <span className="mr-1">
                                    {passwordIncludeUsername && (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x text-red-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>)}
                                    {!passwordIncludeUsername && (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check text-green-500"><path d="M20 6 9 17l-5-5"/></svg>)}
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
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
