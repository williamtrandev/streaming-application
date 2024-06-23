import { useState, useContext, useEffect } from "react";
import { formatNumFollowers } from "../../utils/formatNumber";
import FollowButton from "./FollowButton";
import { Dot } from "lucide-react";
import { useGetStreamerProfile } from "../../api/user";

const ProfileHeader = ({ username }) => {

    const [streamer, setStreamer] = useState(null);

    const { data: streamerData } = useGetStreamerProfile(username);
    useEffect(() => {
		if (streamerData) {
            setStreamer(streamerData);
		}
	}, [streamerData]);

    return (
        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {!streamer && <div className="text-xl p-4">
                Channel Not Found
            </div>}
            {streamer && <div className="z-20 h-20 md:h-40 overflow-hidden">
                <img
                    src={streamer?.profileBanner}
                    alt="profile banner"
                    className="rounded-tl-lg rounded-tr-lg object-cover object-center aspect-[5/1]"
                />
            </div>}
            {streamer && <div className="px-3 pb-3 md:px-6 md:pb-6 flex gap-4">
                <div className="z-30 md:mt-4 h-20 w-full max-w-20 rounded-full 
                    bg-black/20 dark:bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                    <div className="drop-shadow-2">
                        <img src={streamer?.profilePicture} alt="profile" className="rounded-full object-cover" />
                    </div>
                </div>
                <div className="space-y-2 md:mt-4">
                    <h3 className="text-sm md:text-3xl font-semibold text-black dark:text-white">
                        {streamer?.fullname}
                    </h3>
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="italic text-xs md:text-base">
                            {streamer?.username}
                        </div>
                        <Dot className="hidden md:block" />
                        <div className="text-xs md:text-base">
                            {formatNumFollowers(streamer?.numFollowers)} followers
                        </div>
                    </div>
                    <FollowButton streamerId={streamer?._id} streamerName={streamer?.fullname} />
                </div>
            </div>}
        </div>
    );
}

export default ProfileHeader;
