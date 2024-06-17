import { Link, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useChangeLinks } from "../../api/user";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const SocialLinks = ({ userLinks }) => {
    const [links, setLinks] = useState(userLinks);
    const [newLinkTitle, setNewLinkTitle] = useState("");
    const [newLinkUrl, setNewLinkUrl] = useState("");

    const [saveDisable, setSaveDisable] = useState(true);

    useEffect(() => {
        if (userLinks) {
            setLinks(userLinks || []);
        }
    }, [userLinks]);

    const { mutate, isPending, isError, error, isSuccess, data } = useChangeLinks();

    const handleSave = async () => {
        mutate({ links });
    };

    useEffect(() => {
        if (data) {
            toast.success("Change social links successfully");
            setSaveDisable(true);
        }
    }, [isSuccess]);

    useEffect(() => {
        const errorMessage = error?.response?.data?.message;
        toast.error(errorMessage);
    }, [isError]);

    return (
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
                                setNewLinkTitle("");
                                setNewLinkUrl("");
                                setSaveDisable(false);
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
                                    onClick={() => {
                                        setLinks(links.filter((_, i) => i !== index));
                                        setSaveDisable(false);
                                    }}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {!saveDisable && <div className="flex justify-end py-4">
                    <button
                        className={`px-3 py-1 bg-purple-600 rounded-lg text-white hover:bg-purple-700
                                ${isPending ? "pointer-events-none opacity-50" : ""}`}
                        onClick={handleSave}
                    >
                        {isPending ? "Saving..." : "Save"}
                    </button>
                </div>}
            </div>
        </div>
    );
}

export default SocialLinks;
