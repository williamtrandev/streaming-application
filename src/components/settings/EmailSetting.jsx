import { useEffect, useState } from "react";
import { useGetEmail } from "../../api/user";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { useChangeEmail } from "../../api/auth";
import SendOtpButton from "../auth/SendOtpButton";
import { Pencil, Shield, X } from "lucide-react";
import EmailInput from "../auth/EmailInput";

const EmailSetting = () => {
    const { auth } = useAuth();
    const userId = auth?.user?._id;
    const { authEmail, setAuthEmail } = useUser();

    const { data: userData } = useGetEmail(userId);

    const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);

    useEffect(() => {
        if (userData) {
            setAuthEmail(userData.email);
            setEmail(userData.email)
        }
    }, [userData]);

    const [email, setEmail] = useState(authEmail);
    const [otp, setOtp] = useState("");

    const [isValidEmail, setIsValidEmail] = useState(false);

    const changeEmailDisabled = email == "" || otp == "" || email == authEmail || !isValidEmail || otp.length < 6;

    const { mutate, isPending, isError, error, isSuccess, data } = useChangeEmail();

    const handleSave = async () => {
        mutate({ email, otp });
    };

    useEffect(() => {
        if (data) {
            toast.success("Change email successfully");
            setAuthEmail(data?.newEmail);
            setShowChangeEmailModal(false);
            setOtp("");
        }
    }, [isSuccess]);

    useEffect(() => {
        const errorMessage = error?.response?.data?.message;
        toast.error(errorMessage);
    }, [isError]);

    return (
        <div className="flex w-full gap-4 py-4 md:py-6">
            <div className="w-[30%]">Email</div>
            <div className="w-full relative">
                <div
                    className="w-full px-3 py-1 dark:text-white rounded-lg bg-slate-200 dark:bg-meta-4"
                >
                    {authEmail}
                </div>
                <button
                    className="absolute right-0 top-0 h-full p-2 rounded-r-lg dark:text-white 
                                hover:bg-gray-500"
                    onClick={() => setShowChangeEmailModal(true)}
                >
                    <Pencil size={16} />
                </button>
            </div>
            <Modal
                open={showChangeEmailModal}
                onCancel={() => setShowChangeEmailModal(false)}
                onOk={handleSave}
                confirmLoading={isPending}
                closeIcon={<X className="dark:text-slate-200" />}
                okText={"Change email"}
                okButtonProps={{ className: 'bg-purple-600 hover:!bg-purple-700', disabled: changeEmailDisabled }}
				cancelButtonProps={{ className: 'border-purple-600 hover:!border-purple-700 hover:!text-purple-700' }}
                className="bg-slate-100 dark:bg-slate-800 rounded-lg dark:text-slate-200 pb-0"
            >
                <div className="space-y-4">
                    <div>
                        <div className="text-xl font-bold">Change Email</div>
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
                </div>
            </Modal>
        </div>
    );
}

export default EmailSetting;
