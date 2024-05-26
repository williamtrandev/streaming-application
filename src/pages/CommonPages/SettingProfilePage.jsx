import { useContext, useRef, useState } from "react";
import { fakeStreamer } from "../../constants";
import { ModalContext } from "../../layouts/ModalContext";
import { Check } from "lucide-react";

const SettingProfilePage = () => {

	const user = fakeStreamer;

    const { setShowCropperModal, setSrc, preview, settingProfilePicture } = useContext(ModalContext);
    const fileInputRef = useRef(null);

    const [previewBanner, setPreviewBanner] = useState(null);
    const [profileBanner, setProfileBanner] = useState(null);

    const [username, setUsername] = useState(user.username);
    const [name, setName] = useState(user.name);
    // const [about, setAbout] = useState(user.about.text);
    // const [links, setLinks] = useState(user.about.links);
    // const [newLinkTitle, setNewLinkTitle] = useState("");
    // const [newLink, setNewLink] = useState("");

    const [changeSaved, setChangeSaved] = useState(false);

    const saveDisable = (username === user.username && name === user.name && !profileBanner && !settingProfilePicture) || 
        username === "" || name === "";

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="text-xl">Profile Picture</div>
                <div className="flex flex-col md:flex-row gap-6 items-center p-4 md:p-6 rounded-lg
                    bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
                    <div className="h-30 w-30">
                        <img src={preview || user.profile_picture} alt="profile" className="rounded-full object-cover" />
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
                            Choose profile picture
                        </label>
                        <p className="text-center md:text-start">Must be JPG, JPEG, PNG and cannot exceed 10MB.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="text-xl">Profile Banner</div>
                <div className="flex flex-col gap-4 items-center p-4 md:p-6 rounded-lg
                    bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
                    <div className="z-20 h-16 md:h-50 overflow-hidden">
                        <img
                            src={previewBanner || user.profile_banner}
                            alt="profile banner"
                            className="object-cover object-center aspect-[5/1] w-full"
                        />
                    </div>
                    <div className="gap-3 flex flex-col items-center">
                        <label
                            htmlFor="pb_input"
                            className="cursor-pointer px-3 py-2 text-white rounded-lg w-fit
                            bg-purple-600 hover:bg-purple-700">
                            <input type="file" id="pb_input" className="sr-only"
                                onChange={async (e) => {
                                    setPreviewBanner(URL.createObjectURL(e.target.files[0]));
                                    setProfileBanner(e.target.files[0]);
                                }}
                            />
                            Choose profile banner
                        </label>
                        <p className="text-center md:text-start">File format: JPG, JPEG, PNG (recommended 5x1 ratio, max 10MB)</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="text-xl">Profile Settings</div>
                <div className="px-4 md:px-6 rounded-lg divide-y divide-gray-300 dark:divide-gray-600
                    bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
                    <div className="flex justify-between w-full gap-4 items-start py-4">
                        <div className="w-[35%] font-bold">Username</div>
                        <div className="w-full">
                            <input type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-1 dark:text-white rounded-lg
                                    bg-slate-200 dark:bg-meta-4"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between w-full gap-4 items-start py-4">
                        <div className="w-[35%] font-bold">Display name</div>
                        <div className="w-full">
                            <input type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-1 dark:text-white rounded-lg
                                    bg-slate-200 dark:bg-meta-4"
                            />
                        </div>
                    </div>

                    {/* <div className="flex justify-between w-full gap-4 items-start py-4">
                        <div className="w-[35%] font-bold">About</div>
                        <div className="w-full divide-y">
                            <textarea
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                className="w-full px-3 py-1 dark:text-white rounded-lg
                                    bg-slate-200 dark:bg-meta-4 h-40 resize-none"
                            />
                            <div className="mt-3 pt-3">
                                <div className="font-bold mb-2">Links</div>
                                <div className="space-y-2">
                                    {links.map((link, index) => (
                                        <div
                                            key={index}
                                            className="rounded-md px-2 py-1 bg-slate-200 dark:bg-slate-700
                                                flex justify-between gap-3"
                                        >
                                            <div>
                                                <div className="font-bold">{link.title}</div>
                                                <div className="underline">{link.link}</div>
                                            </div>
                                            <button
                                                className="hover:text-neutral-500 dark:hover:text-white"
                                                onClick={() => {
                                                    const updatedLinks = links.filter((_, i) => i !== index);
                                                    setLinks(updatedLinks);
                                                }}
                                            >
                                                <Trash2 />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 space-y-3 border p-3 rounded-lg">
                                    <div className="">
                                        <div className="whitespace-nowrap">Link title</div>
                                        <input type="text"
                                            className="w-full px-3 py-1 dark:text-white rounded-lg
                                                bg-slate-200 dark:bg-meta-4"
                                            value={newLinkTitle}
                                            onChange={(e) => setNewLinkTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="">
                                        <div className="whitespace-nowrap">Link</div>
                                        <input type="text"
                                            className="w-full px-3 py-1 dark:text-white rounded-lg
                                                bg-slate-200 dark:bg-meta-4"
                                            value={newLink}
                                            onChange={(e) => setNewLink(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            const nLink = { title: newLinkTitle, link: newLink };
                                            const updateLinks = [...links, nLink];
                                            setNewLinkTitle("");
                                            setNewLink("");
                                            setLinks(updateLinks);
                                        }}
                                        className={`px-2 py-1 rounded-lg flex gap-1
                                            bg-neutral-300 dark:bg-neutral-700
                                            hover:bg-neutral-400 dark:hover:bg-neutral-800
                                            ${newLinkTitle === "" || newLink === "" ? "pointer-events-none opacity-50" : ""}`}
                                    >
                                        <Plus /><span>New link</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div> */}


                </div>
            </div>

            <div className="flex justify-end py-4">
                {!changeSaved && <button
                    className={`px-3 py-1 bg-purple-600 rounded-lg text-xl text-white hover:bg-purple-700
                                ${saveDisable ? "pointer-events-none opacity-50" : ""}`}
                    onClick={() => setChangeSaved(true)}
                >Save</button>}
                {changeSaved && <div
                    className="px-3 py-1 bg-green-500 rounded-lg text-xl text-black flex gap-2"
                >
                    <Check />
                    Saved
                </div>}
            </div>
        </div>
    );
}

export default SettingProfilePage;
