import { ZoomIn, ZoomOut } from "lucide-react";
import { useContext, useRef, useState, useEffect } from "react";
import AvatarEditor from "react-avatar-editor";
import { useChangeProfilePicture } from "../../api/user";
import { toast } from "react-toastify";
import { ModalContext } from "../../contexts/ModalContext";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import { blobToBase64 } from "../../utils";

const CropperModal = ({ show, onClose }) => {
    if (!show) return null;
    const cropRef = useRef(null);
    const [scale, setScale] = useState(1.0);
    const { src } = useContext(ModalContext);

    const { setAuthProfilePicture } = useUser();
    const { mutate, isPending, isError, error, isSuccess, data } = useChangeProfilePicture();

    const handleSave = async () => {
        const image = cropRef.current.getImage().toDataURL();
        const profilePicture = await blobToBase64(image);
        mutate({ profilePicture });
    };

    useEffect(() => {
        if(data) {
            setAuthProfilePicture(data.newProfilePicture);
            toast.success("Change profile picture successfully");
            onClose();
        }
    }, [isSuccess]);

    useEffect(() => {
        const errorMessage = error?.response?.data?.message;
        toast.error(errorMessage);
    }, [isError]);

    return (
        <div className="fixed z-9999 inset-0 flex justify-center items-center
            bg-black bg-opacity-75 backdrop-blur-sm"
        >
            <div className="relative bg-white dark:bg-boxdark p-5 rounded-lg space-y-4">
                <div className="text-xl text-center">
                    Change profile picture
                </div>
                <div className="flex flex-col justify-center items-center">
                    <AvatarEditor
                        ref={cropRef}
                        image={src}
                        width={250}
                        height={250}
                        border={50}
                        borderRadius={125}
                        color={[0, 0, 0, 0.72]}
                        scale={scale}
                        rotate={0}
                        className="mb-4"
                    />
                    <div className="w-full flex justify-between gap-3">
                        <div><ZoomOut /></div>
                        <input
                            type="range"
                            min="1"
                            max="2"
                            step="0.01"
                            value={scale}
                            onChange={(e) => {
                                const scaleValue = parseFloat(e.target.value);
                                setScale(scaleValue);
                            }}
                            className="cursor-pointer w-full"
                        />
                        <div><ZoomIn /></div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-2 py-1 rounded-md
                            bg-slate-300 dark:bg-slate-700
                            hover:bg-slate-400 dark:hover:bg-slate-600"
                        onClick={onClose}
                    >Cancel</button>
                    <button
                        className={`px-2 py-1 rounded-md
                            bg-purple-600 text-white hover:bg-purple-700
                            ${isPending ? "pointer-events-none opacity-50" : ""}`}
                        onClick={handleSave}
                    >
                        {isPending ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CropperModal;
