
import { Link } from 'react-router-dom';
import { Users } from "lucide-react";
const StreamCard = ({
	index,
	streamer
}) => {
	return (
		<Link to={`/live/${streamer.id}`}>
			<div className='bg-white dark:bg-meta-4 rounded-2xl text-theme shadow-md overflow-hidden'>
				<img src={streamer.preview_image} alt="" className="object-contain" />
				<div className='p-3 flex flex-wrap items-center gap-1 space-x-2'>
					<img src={streamer.user.avatar} alt="" className="rounded-full w-8" />
					<div>
						<h3 className='text-theme font-bold text-md'>{streamer.title}</h3>
						<p className='font-extralight text-sm'>{streamer.user.name}</p>
					</div>
					<p className="w-full flex justify-end items-center space-x-2">
						<Users className="w-4" />
						<span>{streamer.num_viewers}</span>
					</p>
				</div>
			</div>
		</Link>
	);
};

export default StreamCard;