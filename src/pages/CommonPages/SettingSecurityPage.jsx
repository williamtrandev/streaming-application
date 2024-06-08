import { useContext, useEffect, useRef, useState } from "react";
import { fakeStreamer } from "../../constants";
import { Pencil } from "lucide-react";
import { ModalContext } from "../../contexts/ModalContext";
import { useAuth } from "../../contexts/AuthContext";
import { useGetEmail } from "../../api/user";
import SendOtpButton from "../../components/auth/SendOtpButton";
import { useUser } from "../../contexts/UserContext";

const SettingSecurityPage = () => {

    const { auth } = useAuth();
    const { authEmail, setAuthEmail } = useUser();
    const userId = auth?.user?.userId;
    const { data: userData } = useGetEmail(userId);

    const { setShowChangePasswordModal, setShowChangeEmailModal } = useContext(ModalContext);

    useEffect(() => {
        if (userData) {
            setAuthEmail(userData.email);
        }
    }, [userData]);

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

export default SettingSecurityPage;
