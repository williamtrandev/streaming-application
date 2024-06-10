import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useUnfollow } from "../../api/user";
import { ModalContext } from "../../contexts/ModalContext";

const UnfollowModal = ({ show, onClose }) => {
    if (!show) return null;

    const { setFollowed, unfollowId, unfollowName, } = useContext(ModalContext);

    // Unfollow
    const { mutate, isError, isSuccess, error, data } = useUnfollow();

    const handleUnfollow = () => {
        mutate({ streamerId: unfollowId });
    };

    useEffect(() => {
        if (data) {
            setFollowed(false);
            onClose();
        }
    }, [isSuccess]);

    useEffect(() => {
        const errorMessage = error?.response?.data?.message;
        toast.error(errorMessage);
    }, [isError]);

    return (
        <div className="fixed z-9999 inset-0 flex justify-center items-center
        bg-black bg-opacity-75 backdrop-blur-sm">
            <div className="w-[500px] relative bg-white dark:bg-boxdark p-5 rounded-lg space-y-4">
                <div className="text-xl">
                    Unfollow <span className="font-bold">{unfollowName}</span>?
                </div>
                <div>You will no longer receive notifications or see them in your followed streamers list.</div>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-2 py-1 rounded-md
                            bg-slate-300 dark:bg-slate-700
                            hover:bg-slate-400 dark:hover:bg-slate-600"
                        onClick={onClose}
                    >Cancel</button>
                    <button
                        className="px-2 py-1 rounded-md
                            bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-500"
                        onClick={handleUnfollow}
                    >Unfollow</button>
                </div>
            </div>
        </div>
    );
}

export default UnfollowModal;
