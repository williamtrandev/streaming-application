import { Link } from 'react-router-dom';
import { Radio, Users } from "lucide-react";
import { formatNumViewers } from '../../utils/formatNumber';

const HorizontalStreamCard = ({ stream }) => {
    return (
        <Link to={`/live/${stream.id}`} className="hover:scale-105">
            <div className='bg-white dark:bg-meta-4 rounded-2xl text-theme shadow-md overflow-hidden 
                flex gap-4 p-4'>
                <div className="relative w-[30%]">
                    <img src={stream.preview_image} alt="" className="object-contain rounded-lg" />
                    <div className="bg-red-600 text-white px-1 rounded-md text-sm
						absolute bottom-3 right-3 flex items-center gap-1">
                        <Radio size={16} />
                        LIVE
                    </div>
                </div>

                <div className="pr-3 space-y-2">
                    <h3 className="text-theme font-bold text-xl">{stream.title}</h3>
                    <div className="font-extralight text-md hover:underline">
                        <Link to={`/${stream.user.id}`}>{stream.user.name}</Link>
                    </div>
                    <p className="w-full flex items-center space-x-2">
                        <Users className="w-4" />
                        {formatNumViewers(stream.num_viewers)}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default HorizontalStreamCard;
