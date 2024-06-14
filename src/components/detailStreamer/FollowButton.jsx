import { UserPlus, Bell, BellOff, ChevronDown, UserMinus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFollow, useGetFollow, useToggleNotification, useUnfollow } from "../../api/user";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { Button, Modal } from "antd";

const FollowButton = ({ streamerId, streamerName }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notification, setNotification] = useState(true);
    const [showUnfollowModal, setShowUnfollowModal] = useState(false);

    const [followed, setFollowed] = useState(false);

    const { auth } = useAuth();
    const userId = auth?.user?._id;
    const { data: followData } = useGetFollow({ userId, streamerId });
    useEffect(() => {
        if (followData) {
            setFollowed(followData.follow != null);
            setNotification(followData.follow?.receiveNotification);
        }
    }, [followData]);

    // Follow
    const followMutation = useFollow();

    const handleFollow = async () => {
        followMutation.mutate({ streamerId });
    };

    useEffect(() => {
        if (followMutation.data) {
            setFollowed(true);
            setNotification(followMutation.data.receiveNotification);
        }
    }, [followMutation.isSuccess]);

    useEffect(() => {
        const errorMessage = followMutation.error?.response?.data?.message;
        toast.error(errorMessage);
    }, [followMutation.isError]);

    // Notification change API
    const toggleNotificationMutation = useToggleNotification();

    const handleToggleNotification = async () => {
        toggleNotificationMutation.mutate({ streamerId });
    };

    useEffect(() => {
        if (toggleNotificationMutation.data) {
            setNotification(toggleNotificationMutation.data.receiveNotification);
        }
    }, [toggleNotificationMutation.isSuccess]);

    useEffect(() => {
        const errorMessage = toggleNotificationMutation.error?.response?.data?.message;
        toast.error(errorMessage);
    }, [toggleNotificationMutation.isError]);

    // Unfollow
    const unfollowMutation = useUnfollow();

    const handleUnfollow = () => {
        unfollowMutation.mutate({ streamerId });
    };

    useEffect(() => {
        if (unfollowMutation.data) {
            setFollowed(false);
            setShowUnfollowModal(false);
        }
    }, [unfollowMutation.isSuccess]);

    useEffect(() => {
        const errorMessage = unfollowMutation.error?.response?.data?.message;
        toast.error(errorMessage);
    }, [unfollowMutation.isError]);

    return (
        <div>
            {!followed && <div>
                <button
                    onClick={handleFollow}
                    className="flex space-x-2 items-center text-white bg-blue-700 
                        hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
                        px-3 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    <span><UserPlus size={16} /></span>
                    <span className="text-sm md:text-lg">Follow</span>
                </button>
            </div>}
            {followed && <div className="relative">
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex space-x-2 items-center text-white bg-purple-700 
                        hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm 
                        px-3 py-1 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800">
                    <span>
                        {notification && <Bell size={20} />}
                        {!notification && <BellOff size={20} />}
                    </span>
                    <span className="text-sm md:text-lg">Followed</span>
                    <span><ChevronDown size={16} /></span>
                </button>
                <div className={`absolute -left-1 mt-2 w-45 flex flex-col rounded-sm border border-stroke 
                    shadow-default dark:border-strokedark z-9999
                    ${dropdownOpen === true ? 'block' : 'hidden'}`}
                >
                    <button
                        onClick={() => {
                            handleToggleNotification();
                            setDropdownOpen(false);
                        }}
                        className="flex gap-2 items-center p-4
                        bg-white dark:bg-boxdark hover:bg-neutral-200 dark:hover:bg-neutral-700">
                        {notification && <BellOff size={20} />}
                        {notification && <span>No notification</span>}
                        {!notification && <Bell size={20} />}
                        {!notification && <span>Notification</span>}
                    </button>
                    <button
                        onClick={() => {
                            // handleShowUnfollowModal(streamerId, streamerName);
                            setShowUnfollowModal(true);
                            setDropdownOpen(false);
                        }}
                        className="flex gap-2 items-center p-4
                            bg-white dark:bg-boxdark hover:bg-neutral-200 dark:hover:bg-neutral-700">
                        <UserMinus size={20} />
                        <span>Unfollow</span>
                    </button>
                </div>
            </div>}
            <Modal
                open={showUnfollowModal}
                centered
                onCancel={() => setShowUnfollowModal(false)}
                onClose={() => setShowUnfollowModal(false)}
                closeIcon={<X className="dark:text-slate-200" />}
                className="bg-slate-100 dark:bg-slate-700 rounded-lg dark:text-slate-200 pb-0"
                footer={[
                    <Button
                        key={1}
                        className="!bg-slate-300 dark:!bg-slate-600 !border-none !text-black dark:!text-white
                            hover:!bg-slate-400 dark:hover:!bg-slate-500"
                        onClick={() => setShowUnfollowModal(false)}
                    >Cancel</Button>,
                    <Button
                        key={2}
                        type="primary" 
                        danger
                        onClick={handleUnfollow}
                    >Unfollow</Button>
                ]}
            >
                <div className="space-y-2">
                    <div className="text-xl">
                        Unfollow <span className="font-bold">{streamerName}</span>?
                    </div>
                    <div>You will no longer receive notifications or see them in your followed streamers list.</div>
                </div>
            </Modal>
        </div>
    );
}

export default FollowButton;
