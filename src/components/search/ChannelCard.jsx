import { Link } from "react-router-dom";

const ChannelCard = ({ streamer }) => {
    return (
        <Link to={`/${streamer.username}`}>
			<div className="rounded-2xl border-r-2 border-b-2 border-transparent
			hover:border-purple-600 dark:hover:border-gray-300">
				<div 
                    className='flex flex-col justify-center items-center gap-4 p-3
                    bg-white dark:bg-meta-4 rounded-2xl text-theme shadow-md overflow-hidden'
                >
					<span className="w-15 h-15 md:w-30 md:h-30 rounded-full">
                        <img src={streamer.profilePicture.url} alt="pp" className="w-15 h-15 md:w-30 md:h-30 rounded-full" />
                    </span>
                    <div className="space-y-2 w-full">
                        <div className="font-bold truncate w-full text-sm md:text-md text-center">
                            {streamer.fullname}
                        </div>
                        <p className="text-xs md:text-sm truncate w-full text-center">{streamer.username}</p>
                    </div>
				</div>
			</div>
		</Link>
    );
}

export default ChannelCard;
