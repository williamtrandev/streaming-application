import { Link } from 'react-router-dom';
import { Radio, Users } from "lucide-react";
import { formatNumViewers } from '../../utils/formatNumber';
const StreamCard = ({
	index,
	stream
}) => {
	return (
		<Link to={`/live/${stream.id}`}>
			<div className='bg-white dark:bg-meta-4 rounded-2xl text-theme shadow-md overflow-hidden border-2 border-transparent
				hover:border-purple-400 dark:hover:border-purple-800'>
				<div className="relative">
					<img src={stream.preview_image} alt="" className="object-contain" />
					<div className="bg-red-600 text-white px-1 rounded-md text-sm
						absolute bottom-3 right-3 flex items-center gap-1">
						<Radio size={16} />
						LIVE
					</div>
				</div>
				
				<div className='p-3 flex flex-wrap items-center gap-1 space-x-2'>
					<img src={stream.user.profile_picture} alt="" className="rounded-full w-8" />
					<div>
						<h3 className='text-theme font-bold text-md'>{stream.title}</h3>
						<div className='font-extralight text-sm hover:underline'>
							<Link to={`/${stream.user.id}`}>{stream.user.name}</Link>
						</div>
					</div>
					
					<p className="w-full flex justify-end items-center space-x-2">
						<Users className="w-4" />
						{formatNumViewers(stream.num_viewers)}
					</p>
				</div>
			</div>
		</Link>
	);
};

export default StreamCard;