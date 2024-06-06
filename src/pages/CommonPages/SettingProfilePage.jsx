import { useContext, useEffect, useRef, useState } from "react";
import { Check, Pencil, Trash2, Plus, Link } from "lucide-react";
import { ModalContext } from "../../contexts/ModalContext";
import { useGetProfile } from "../../api/user";
import { useAuth } from "../../contexts/AuthContext";
import ProfileBanner from "../../components/settings/ProfileBanner";
import ProfileSettings from "../../components/settings/ProfileSettings";
import SocialLinks from "../../components/settings/SocialLinks";
import { useUser } from "../../contexts/UserContext";

const SettingProfilePage = () => {
    const { auth } = useAuth();
    const { authProfilePicture } = useUser();
	const userId = auth?.user?.userId;
    const { data: userData } = useGetProfile(userId);

    const { setShowCropperModal, setSrc } = useContext(ModalContext);
    const fileInputRef = useRef(null);

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="text-xl">Profile Picture</div>
                <div className="flex flex-col md:flex-row gap-6 items-center p-4 md:p-6 rounded-lg
                    bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
                    <span className="h-30 w-30 overflow-hidden">
                        <img src={authProfilePicture || userData?.profilePicture} alt="profile" className="rounded-full object-cover" />
                    </span>
                    <div className="space-y-5 flex flex-col items-center md:items-start md:justify-start">
                        <label
                            htmlFor="pp_input"
                            className="cursor-pointer px-3 py-2 text-white rounded-lg w-fit
                                bg-purple-600 hover:bg-purple-700">
                            <input type="file" id="pp_input"
                                className="sr-only"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={(e) => {
                                    setSrc(URL.createObjectURL(e.target.files[0]));
                                    fileInputRef.current.value = null;
                                    setShowCropperModal(true);
                                }}
                            />
                            Change profile picture
                        </label>
                        <p className="text-center md:text-start">Must be JPG, JPEG, PNG and cannot exceed 10MB.</p>
                    </div>
                </div>
            </div>

            <ProfileBanner profileBanner={userData?.profileBanner} />

            <ProfileSettings 
                username={userData?.username} 
                userFullname={userData?.fullname} 
                userAbout={userData?.about} 
                canChangeUsername={userData?.canChangeUsername}
            />

            <SocialLinks userLinks={userData?.links} />
        </div>
    );
}

export default SettingProfilePage;
