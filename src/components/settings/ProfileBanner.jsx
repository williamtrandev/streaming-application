import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useChangeProfileBanner } from "../../api/user";
import { useAuth } from "../../contexts/AuthContext";

const ProfileBanner = ({ profileBanner }) => {
    const [previewBanner, setPreviewBanner] = useState(null);
    const [newProfileBanner, setNewProfileBanner] = useState(null);

    const { auth } = useAuth();
    const token = auth?.accessToken;
    const { mutate, isLoading, isError, error, isSuccess, data } = useChangeProfileBanner();

    const handleSave = async () => {
        mutate({ token, profileBanner: newProfileBanner });
    };

    useEffect(() => {
        if(data) {
            toast.success("Change profile banner successfully");
            setNewProfileBanner(null);
        }
    }, [isSuccess]);

    useEffect(() => {
        const errorMessage = error?.response?.data?.message;
        toast.error(errorMessage);
    }, [isError]);

    return (
        <div className="space-y-2">
            <div className="text-xl">Profile Banner</div>
            <div className="flex flex-col gap-4 items-center p-4 md:p-6 rounded-lg
                    bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
                <div className="z-20 h-16 md:h-50 overflow-hidden">
                    <img
                        src={previewBanner || profileBanner}
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
                                setNewProfileBanner(e.target.files[0]);
                            }}
                        />
                        Change profile banner
                    </label>
                    {newProfileBanner && <button 
                        className={`cursor-pointer px-3 py-2 text-white rounded-lg w-fit
                            bg-purple-600 hover:bg-purple-700
                            ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                        onClick={handleSave}
                    >
                        {isLoading ? "Saving..." : "Save banner"}
                    </button>}
                    <p className="text-center md:text-start">File format: JPG, JPEG, PNG (recommended 5x1 ratio, max 10MB)</p>
                </div>
            </div>
        </div>
    );
}

export default ProfileBanner;
