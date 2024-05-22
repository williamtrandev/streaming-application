import React from "react";

const UnfollowModal = ({ show, onClose, onUnfollow, streamerName }) => {
    if (!show) return null;
    return (
        <div className="fixed z-9999 inset-0 flex justify-center items-center
        bg-black bg-opacity-75 backdrop-blur-sm">
            <div className="w-[500px] relative bg-white dark:bg-boxdark p-5 rounded-lg space-y-4">
                <div className="text-xl">
                    Unfollow <span className="font-bold">{streamerName}</span>?
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
                        onClick={onUnfollow}
                    >Unfollow</button>
                </div>
            </div>
        </div>
    );
}

export default UnfollowModal;
