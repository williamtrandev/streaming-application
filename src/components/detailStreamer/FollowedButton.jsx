import { useState } from "react";
import { Bell, BellOff, ChevronDown, UserMinus } from "lucide-react";

const FollowedButton = ({ onUnfollowClick, streamerName }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notification, setNotification] = useState(true);
    return (
        <div className="relative">
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
                shadow-default dark:border-strokedark
                z-9999
                ${dropdownOpen === true ? 'block' : 'hidden'}`}>
                <button 
                    onClick={() => {
                        setNotification(!notification);
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
                        onUnfollowClick(streamerName);
                        setDropdownOpen(false);
                    }}
                    className="flex gap-2 items-center p-4
                    bg-white dark:bg-boxdark hover:bg-neutral-200 dark:hover:bg-neutral-700">
                    <UserMinus size={20} />
                    <span>Unfollow</span>
                </button>
            </div>
        </div>
    );
}

export default FollowedButton;
