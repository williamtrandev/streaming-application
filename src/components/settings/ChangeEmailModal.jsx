import { toast } from "react-toastify";
import { useUser } from "../../contexts/UserContext";
import { useChangeEmail } from "../../api/auth";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Shield, X } from "lucide-react";
import EmailInput from "../auth/EmailInput";
import SendOtpButton from "../auth/SendOtpButton";

const ChangeEmailModal = ({ show, onClose }) => {
    if (!show) return null;

    const { authEmail, setAuthEmail } = useUser();

    const [email, setEmail] = useState(authEmail);
    const [otp, setOtp] = useState("");

    const [isValidEmail, setIsValidEmail] = useState(false);

    const changeEmailDisabled = email == "" || otp == "" || email == authEmail || !isValidEmail;

    const { auth } = useAuth();
    const token = auth?.accessToken;
    const { mutate, isLoading, isError, error, isSuccess, data } = useChangeEmail();

    const handleSave = async () => {
        mutate({ token, email, otp });
    };

    useEffect(() => {
        if (data) {
            toast.success("Change email successfully");
            setAuthEmail(data?.newEmail);
            onClose();
        }
    }, [isSuccess]);

    useEffect(() => {
        const statusCode = error?.response?.status;
        const errorMessage = error?.response?.data?.error;
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
                    <div className="text-xl font-bold">Change Email</div>
                    <button
                        className="text-xl place-self-end absolute top-2 right-2
                            hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded"
                        onClick={onClose}
                    >
                        <X />
                    </button>
                </div>
                <div className="mb-4">
                    <EmailInput
                        value={email}
                        setEmail={setEmail}
                        setIsValid={setIsValidEmail}
                    />
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
                        <SendOtpButton
                            email={email}
                            isValidEmail={isValidEmail}
                        />
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
                            ${changeEmailDisabled || isLoading ? "pointer-events-none opacity-50" : ""}`}
                        onClick={handleSave}
                    >
                        {isLoading ? "Saving..." : "Change Email"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangeEmailModal;
