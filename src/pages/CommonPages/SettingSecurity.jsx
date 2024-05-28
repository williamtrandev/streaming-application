import { useContext, useRef, useState } from "react";
import { ModalContext } from "../../layouts/ModalContext";
import { fakeStreamer } from "../../constants";
import { Pencil } from "lucide-react";

const SettingSecurity = () => {
    const user = fakeStreamer;

    const { setShowChangePasswordModal } = useContext(ModalContext);

    const [email, setEmail] = useState(user.email);
    const emailRef = useRef(null);
    const [emailReadOnly, setEmailReadOnly] = useState(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);

    const saveEmailDisable = email == "" || email == user.email || !isValidEmail;

    return (
        <div className="space-y-6">
            {/* <div className="text-xl">Security</div> */}
            <div
                className="px-4 md:px-6 rounded-lg
                    bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none 
                    divide-y divide-gray-300 dark:divide-gray-600"
            >
                <div className="flex w-full gap-4 py-4 md:py-6">
                    <div className="w-[30%]">Email</div>
                    <div className="w-full relative">
                        <input type="text"
                            value={email}
                            ref={emailRef}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-1 dark:text-white rounded-lg bg-slate-200 dark:bg-meta-4 
                                    read-only:focus:outline-none read-only:bg-slate-300 read-only:dark:bg-slate-700"
                            readOnly={emailReadOnly}
                        />
                        {emailReadOnly && <button
                            className="absolute right-0 p-2 h-full hover:bg-slate-400 
                                    dark:hover:bg-slate-500 rounded-r-lg"
                            onClick={() => {
                                setEmailReadOnly(false);
                                emailRef.current.focus();
                            }}
                        >
                            <Pencil size={16} />
                        </button>}
                        {!emailReadOnly && <div className="flex flex-col md:justify-between md:flex-row">
                            <div className="text-red-500 mt-1 text-sm h-auto w-auto">
                                {(!isValidEmail && email != "") ? "*Please enter a valid email." : ""}
                            </div>
                            <div className="mt-2 flex justify-end gap-2">
                                <button
                                    className="px-2 py-1 rounded-md
                                bg-slate-300 dark:bg-slate-700
                                hover:bg-slate-400 dark:hover:bg-slate-600"
                                    onClick={() => {
                                        setEmail(user.email);
                                        setEmailReadOnly(true);
                                    }}
                                >Cancel</button>
                                <button
                                    className={`px-2 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700
                                    ${saveEmailDisable ? "pointer-events-none opacity-50" : ""}`}
                                    onClick={() => {
                                        setEmailReadOnly(true);
                                    }}
                                >Save</button>
                            </div>
                        </div>}
                    </div>
                </div>
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
                </div>
            </div>
        </div>
    );
}

export default SettingSecurity;
