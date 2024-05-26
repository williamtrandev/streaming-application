import { useContext } from "react";
import { ModalContext } from "../../layouts/ModalContext";

const SettingSecurity = () => {
    const { setShowChangePasswordModal } = useContext(ModalContext);

    return (
        <div className="space-y-6">
            {/* <div className="text-xl">Security</div> */}
            <div 
                className="px-4 md:px-6 rounded-lg
                    bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none 
                    divide-y divide-gray-300 dark:divide-gray-600"
            >
                <div className="flex w-full gap-4 py-4 md:py-6">
                    <div className="w-[20%]">Email</div>
                    <div>
                        <button>Change password</button>
                    </div>
                </div>
                <div className="flex w-full gap-4 py-4 md:py-6">
                    <div className="w-[20%]">Password</div>
                    <div className="space-y-2">
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
