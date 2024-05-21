import { useState, useContext } from "react";
import { formatNumFollowers } from "../../utils/formatNumber";
import FollowButton from "./FollowButton";
import FollowedButton from "./FollowedButton";
import { UnfollowModalContext } from "./UnfollowModalProvider";

const ProfileHeader = ({ streamer }) => {
    const [followed, setFollowed] = useState(false);

    const { showModal } = useContext(UnfollowModalContext);

    return (
        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="relative z-20 h-20 md:h-50">
                <img
                    src={streamer.profile_cover}
                    alt="profile cover"
                    className="h-full w-full rounded-tl-lg rounded-tr-lg object-cover object-center"
                />
            </div>
            <div className="px-3 pb-3 md:px-6 md:pb-6 flex gap-4">
                <div className="z-30 -mt-6 md:-mt-15 h-20 w-full max-w-20 rounded-full 
                    bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                    <div className="drop-shadow-2">
                        <img src={streamer.avatar} alt="profile" className="rounded-full object-cover" />
                    </div>
                </div>
                <div className="space-y-2 mt-3">
                    <h3 className="text-sm md:text-3xl font-semibold text-black dark:text-white">
                        {streamer.name}
                    </h3>
                    <div className="text-xs md:text-base">{formatNumFollowers(streamer.num_followers)} followers</div>
                    {!followed && <FollowButton onClick={() => setFollowed(true)} />}
                    {followed && <FollowedButton showUnfollowModal={() => {
                        showModal(streamer.name);
                    }} />}
                </div>
            </div>
        </div>
    );
}

export default ProfileHeader;
