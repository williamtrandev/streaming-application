import { formatNumFollowers } from "../../utils/formatNumber";

const ProfileHeader = ({ streamer }) => {
    return (
        <div className="overflow-hidden rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="relative z-20 h-20 md:h-50">
                <img
                    src={streamer.profile_cover}
                    alt="profile cover"
                    className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
                />
            </div>
            <div className="px-6 pb-6 flex gap-4">
                <div className="relative z-30 -mt-15 h-30 w-full max-w-30 rounded-full 
                    bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                    <div className="relative drop-shadow-2">
                        <img src={streamer.avatar} alt="profile" className="rounded-full object-cover" />
                    </div>
                </div>
                <div className="space-y-2 mt-3">
                    <h3 className="text-3xl font-semibold text-black dark:text-white">
                        {streamer.name}
                    </h3>
                    <div>{formatNumFollowers(streamer.num_followers)} followers</div>
                    <button type="button" className="flex space-x-2 items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        <span className="font-bold text-lg">+</span>
                        <span>Follow</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileHeader;
