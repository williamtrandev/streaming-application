import { Link } from 'react-router-dom';
import { Radio, Users } from "lucide-react";
import { formatNumViewers } from '../../utils/formatNumber';

const HorizontalStreamCard = ({ stream }) => {
    return (
        <Link to={`/live/${stream?._id}`}>
            <div className="rounded-2xl p-0.5 shadow-md hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <div className='bg-white dark:bg-meta-4 rounded-2xl text-theme shadow-md overflow-hidden 
                flex gap-3 md:gap-4 p-2 md:p-4'>
                    <div className="relative w-[45%] md:w-[30%] aspect-video">
                        <img src={stream?.previewImage} alt="" className="object-cover aspect-video rounded-lg" />
                        <div className="bg-red-600 text-white px-1 rounded-md text-xs md:text-sm
						absolute bottom-1 right-1 md:bottom-3 md:right-3 flex items-center gap-1">
                            <Radio size={16} />
                            LIVE
                        </div>
                    </div>

                    <div className="w-[65%] md:w-[70%] space-y-2">
                        <h3 className="text-theme font-bold text-sm md:text-xl
                        line-clamp-1 md:line-clamp-2 overflow-hidden text-ellipsis">
                            {stream?.title}
                        </h3>
                        <div className="font-extralight w-fit text-xs md:text-md hover:underline">
                            <Link to={`/@${stream?.user?.username}`}>{stream?.user?.fullname}</Link>
                        </div>
                        <p className="w-full flex items-center gap-1 text-xs md:text-md">
                            <Users size={16} />
                            {stream?.finished ? formatNumViewers(stream?.numViews) : formatNumViewers(stream?.numViewsLive)}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default HorizontalStreamCard;
