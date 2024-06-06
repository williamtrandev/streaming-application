import { useContext, useEffect, useRef, useState } from "react";
import { Check, Pencil, Trash2, Plus, Link } from "lucide-react";
import { ModalContext } from "../../contexts/ModalContext";
import { useGetProfile } from "../../api/user";
import { useAuth } from "../../contexts/AuthContext";
import ProfileBanner from "../../components/settings/ProfileBanner";
import ProfileSettings from "../../components/settings/ProfileSettings";

const SettingProfilePage = () => {
    const { auth } = useAuth();
	const userId = auth?.user?.userId;
    const { data: userData } = useGetProfile(userId);

    const { setShowCropperModal, setSrc, preview } = useContext(ModalContext);
    const fileInputRef = useRef(null);

    const [links, setLinks] = useState(userData?.links || []);
    const [newLinkTitle, setNewLinkTitle] = useState("");
    const [newLinkUrl, setNewLinkUrl] = useState("");

    useEffect(() => {
        // Update the links state when userData changes
        if (userData) {
            setLinks(userData.links || []);
        }
    }, [userData]);

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="text-xl">Profile Picture</div>
                <div className="flex flex-col md:flex-row gap-6 items-center p-4 md:p-6 rounded-lg
                    bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
                    <div className="h-30 w-30">
                        <img src={preview || userData?.profilePicture} alt="profile" className="rounded-full object-cover" />
                    </div>
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

            <div className="space-y-2">
                <div className="text-xl">Social Links</div>
                <div className="px-4 md:px-6 rounded-lg divide-y divide-gray-300 dark:divide-gray-600
                    bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
                    <div className="py-4 space-y-4">
                        <div>
                            <div>Link Title</div>
                            <input type="text"
                                value={newLinkTitle}
                                onChange={(e) => setNewLinkTitle(e.target.value)}
                                className="w-full px-3 py-1 dark:text-white rounded-lg
                                    bg-slate-200 dark:bg-meta-4"
                            />
                        </div>
                        <div>
                            <div>Link URL</div>
                            <div className="relative">
                                <Link
                                    size={16}
                                    className="absolute left-2 h-full"
                                />
                                <input type="text"
                                    value={newLinkUrl}
                                    onChange={(e) => setNewLinkUrl(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1 dark:text-white rounded-lg
                                        bg-slate-200 dark:bg-meta-4"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-white
                                    bg-purple-600 hover:bg-purple-700
                                    ${newLinkTitle == "" || newLinkUrl == "" ? "pointer-events-none opacity-50" : ""}`}
                                onClick={() => {
                                    const newLink = {
                                        title: newLinkTitle,
                                        link: newLinkUrl
                                    };
                                    const newLinks = [...links, newLink];
                                    setLinks(newLinks);
                                }}
                            >
                                <Plus size={18} />
                                Add
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2 py-4">
                        {links?.map((link, index) => (
                            <div
                                key={index}
                                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 
                                    flex gap-4 justify-between items-center"
                            >
                                <div>
                                    <div className="font-bold text-wrap">{link.title}</div>
                                    <p className="underline break-all text-blue-600 dark:text-blue-400">{link.link}</p>
                                </div>
                                <div className="flex gap-2">
                                    {/* <button
                                        className="rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                                        
                                    >
                                        <Pencil size={20} />
                                    </button> */}
                                    <button
                                        className="rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                                        onClick={() => setLinks(links.filter((_, i) => i !== index))}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingProfilePage;
