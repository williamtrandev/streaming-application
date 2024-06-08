import { useState, useContext } from "react";
import { formatNumFollowers } from "../../utils/formatNumber";
import FollowButton from "./FollowButton";
import FollowedButton from "./FollowedButton";
import { Dot } from "lucide-react";
import { ModalContext } from "../../contexts/ModalContext";

const ProfileHeader = ({ streamer }) => {

    const { handleShowUnfollowModal, followed, setFollowed } = useContext(ModalContext);

    return (
        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="z-20 h-20 md:h-40 overflow-hidden">
                <img
                    src={streamer.profile_banner}
                    alt="profile banner"
                    className="rounded-tl-lg rounded-tr-lg object-cover object-center aspect-[5/1]"
                />
            </div>
            <div className="px-3 pb-3 md:px-6 md:pb-6 flex gap-4">
                <div className="z-30 md:mt-4 h-20 w-full max-w-20 rounded-full 
                    bg-black/20 dark:bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                    <div className="drop-shadow-2">
                        <img src={streamer.profile_picture} alt="profile" className="rounded-full object-cover" />
                    </div>
                </div>
                <div className="space-y-2 md:mt-4">
                    <h3 className="text-sm md:text-3xl font-semibold text-black dark:text-white">
                        {streamer.name}
                    </h3>
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="italic text-xs md:text-base">
                            {streamer.username}
                        </div>
                        <Dot className="hidden md:block" />
                        <div className="text-xs md:text-base">
                            {formatNumFollowers(streamer.num_followers)} followers
                        </div>
                    </div>
                    {!followed && <FollowButton onClick={() => setFollowed(true)} />}
                    {followed && <FollowedButton
                        onUnfollowClick={handleShowUnfollowModal}
                        streamerName={streamer.name} />}
                </div>
            </div>
        </div>
    );
}

export default ProfileHeader;
