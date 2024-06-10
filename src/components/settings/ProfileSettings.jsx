import { Check, Pencil } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useChangeProfileInfo } from "../../api/user";
import { useAuth } from "../../contexts/AuthContext";
import { ModalContext } from "../../contexts/ModalContext";
import { useUser } from "../../contexts/UserContext";

const ProfileSettings = ({ username, userFullname = "", userAbout = "", canChangeUsername }) => {
    const { setShowChangeUsernameModal } = useContext(ModalContext);
    const [currentProfile, setCurrentProfile] = useState({ fullname: userFullname, about: userAbout })
    const [fullname, setFullname] = useState(userFullname);
    const [about, setAbout] = useState(userAbout);

    const saveDisable = !fullname || (fullname == currentProfile.fullname && about == currentProfile.about);

    const { authUsername, setAuthFullname } = useUser();
    const { mutate, isPending, isError, error, isSuccess, data } = useChangeProfileInfo();

    const handleSave = async () => {
        mutate({ fullname, about });
    };

    useEffect(() => {
        if (data) {
            toast.success("Change profile settings successfully");
            setCurrentProfile(data.newUserInfo);
            setAuthFullname(data.newUserInfo.fullname);
        }
    }, [isSuccess]);

    useEffect(() => {
        const errorMessage = error?.response?.data?.message;
        toast.error(errorMessage);
    }, [isError]);

    useEffect(() => {
        setFullname(userFullname);
        setAbout(userAbout);
        setCurrentProfile({ fullname: userFullname, about: userAbout })
    }, [userFullname, userAbout]);

    return (
        <div className="space-y-2">
            <div className="text-xl">Profile Settings</div>
            <div className="px-4 md:px-6 rounded-lg divide-y divide-gray-300 dark:divide-gray-600
                    bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
                <div className="flex justify-between w-full gap-4 items-start py-4">
                    <div className="w-[35%] font-bold">Username</div>
                    <div className="w-full space-y-2">
                        <div className="relative">
                            <div
                                className="w-full px-3 py-1 dark:text-white rounded-lg bg-slate-300 dark:bg-slate-700"
                            >
                                {authUsername}
                            </div>
                            {canChangeUsername && <button
                                className="absolute right-0 top-0 h-full p-2 rounded-r-lg dark:text-white 
                                hover:bg-gray-500"
                                onClick={() => {
                                    setShowChangeUsernameModal(true);
                                }}
                            >
                                <Pencil size={16} />
                            </button>}
                            {/* <button
                                className="absolute right-0 top-0 h-full p-2 rounded-r-lg dark:text-white 
                                hover:bg-gray-500"
                                onClick={() => {
                                    setShowChangeUsernameModal(true);
                                }}
                            >
                                <Pencil size={16} />
                            </button> */}
                        </div>
                        <p>You can only change your username every 14 days</p>
                    </div>
                </div>

                <div className="flex justify-between w-full gap-4 items-start py-4">
                    <div className="w-[35%] font-bold">Display name</div>
                    <div className="w-full">
                        <input type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="w-full px-3 py-1 dark:text-white rounded-lg
                                    bg-slate-200 dark:bg-meta-4"
                        />
                    </div>
                </div>

                <div className="flex justify-between w-full gap-4 items-start py-4">
                    <div className="w-[35%] font-bold">About</div>
                    <div className="w-full">
                        <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            className="w-full px-3 py-1 dark:text-white rounded-lg
                                    bg-slate-200 dark:bg-meta-4 h-60 resize-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end py-4">
                    <button
                        className={`px-3 py-1 bg-purple-600 rounded-lg text-white hover:bg-purple-700
                                ${saveDisable || isPending ? "pointer-events-none opacity-50" : ""}`}
                        onClick={handleSave}
                    >
                        {isPending ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileSettings
