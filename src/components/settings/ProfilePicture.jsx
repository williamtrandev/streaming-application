import { useEffect, useRef, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useChangeProfilePicture } from "../../api/user";
import { blobToBase64 } from "../../utils";
import { toast } from "react-toastify";
import { Modal } from "antd";
import AvatarEditor from "react-avatar-editor";
import { X, ZoomIn, ZoomOut } from "lucide-react";

const ProfilePicture = ({ profilePicture }) => {
    const { authProfilePicture } = useUser();
    const fileInputRef = useRef(null);
    const [src, setSrc] = useState(null);
    const [showCropperModal, setShowCropperModal] = useState(false);

    const cropRef = useRef(null);
    const [scale, setScale] = useState(1.0);

    const { setAuthProfilePicture } = useUser();
    const { mutate, isPending, isError, error, isSuccess, data } = useChangeProfilePicture();

    const handleSave = async () => {
        const image = cropRef.current.getImage().toDataURL();
        const newProfilePicture = await blobToBase64(image);
        mutate({ profilePicture: newProfilePicture });
    };

    useEffect(() => {
        if (data) {
            setAuthProfilePicture(data.newProfilePicture);
            toast.success("Change profile picture successfully");
            setShowCropperModal(false);
        }
    }, [isSuccess]);

    useEffect(() => {
        const errorMessage = error?.response?.data?.message;
        toast.error(errorMessage);
    }, [isError]);

    return (
        <div className="space-y-2">
            <div className="text-xl">Profile Picture</div>
            <div className="flex flex-col md:flex-row gap-6 items-center p-4 md:p-6 rounded-lg
                    bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
                <span className="h-30 w-30 overflow-hidden">
                    <img src={authProfilePicture || profilePicture} alt="profile" className="rounded-full object-cover" />
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
            <Modal
                open={showCropperModal}
                onClose={() => setShowCropperModal(false)}
                onCancel={() => setShowCropperModal(false)}
                closeIcon={<X className="dark:text-slate-200" />}
                okButtonProps={{ className: 'bg-purple-600 hover:!bg-purple-700' }}
				cancelButtonProps={{ className: 'border-purple-600 hover:!border-purple-700 hover:!text-purple-700' }}
                width={500}
                centered
                okText={"Save"}
                className="bg-slate-100 dark:bg-slate-800 rounded-lg dark:text-slate-200 pb-0"
                confirmLoading={isPending}
                onOk={handleSave}
            >
                <div className="space-y-4">
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
                </div>
            </Modal>
        </div>
    );
}

export default ProfilePicture;
