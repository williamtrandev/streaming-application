import { Link } from 'react-router-dom';
import { Radio, Users } from "lucide-react";
import { formatDuration, formatNumViewers, formatTimeDifference } from '../../utils/formatNumber';
const SmallStreamCard = ({
	index,
	stream
}) => {
	return (
		<Link to={`/live/${stream._id}`}>
			<div className="rounded-2xl border-2 border-transparent
				shadow-md transform transition-transform duration-300 hover:scale-105 hover:border-purple-500">
				<div className='bg-white dark:bg-meta-4 rounded-2xl text-theme shadow-md overflow-hidden'>
					<div className="relative aspect-video">
						<img src={stream.previewImage} alt="" className="object-cover aspect-video" />
						<div className="bg-slate-700 text-white px-1 rounded-md text-sm
						absolute bottom-3 right-3 flex items-center gap-1">
							{formatDuration(stream.duration)}
						</div>
					</div>

					<div className='p-3 space-y-2 h-25'>
						<h3 className='text-theme font-bold text-md 
							line-clamp-2 overflow-hidden text-ellipsis'
						>{stream.title}</h3>
						<div className="flex justify-between">
							<p className="w-full flex items-center gap-1 text-sm">
								<Users size={14} className="w-4" />
								{formatNumViewers(stream.numViews)}
							</p>
							<p className="text-sm whitespace-nowrap">
								{formatTimeDifference(stream.dateStream)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default SmallStreamCard;