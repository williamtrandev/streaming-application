import { UserPlus, Bell, BellOff, ChevronDown, UserMinus } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { ModalContext } from "../../contexts/ModalContext";
import { useFollow, useGetFollow, useToggleNotification, useUnfollow } from "../../api/user";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const FollowButton = ({ streamerId, streamerName }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notification, setNotification] = useState(true);

    const { handleShowUnfollowModal, followed, setFollowed } = useContext(ModalContext);

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
                            handleShowUnfollowModal(streamerId, streamerName);
                            setDropdownOpen(false);
                        }}
                        className="flex gap-2 items-center p-4
                            bg-white dark:bg-boxdark hover:bg-neutral-200 dark:hover:bg-neutral-700">
                        <UserMinus size={20} />
                        <span>Unfollow</span>
                    </button>
                </div>
            </div>}
        </div>
    );
}

export default FollowButton;
