import { Link } from 'react-router-dom';
import { Radio, Users } from "lucide-react";
import { formatNumViewers } from '../../utils/formatNumber';
const SmallStreamCard = ({
	index,
	stream
}) => {
	return (
		<Link to={`/live/${stream.id}`}>
			<div className="rounded-2xl border-r-2 border-b-2 border-transparent
				hover:border-purple-600 dark:hover:border-gray-300">
				<div className='bg-white dark:bg-meta-4 rounded-2xl text-theme shadow-md overflow-hidden'>
					<div className="relative">
						<img src={stream.preview_image} alt="" className="object-contain" />
						<div className="bg-slate-700 text-white px-1 rounded-md text-sm
						absolute bottom-3 right-3 flex items-center gap-1">
							01:02:03
						</div>
					</div>

					<div className='p-3 space-y-2 h-25'>
						<h3 className='text-theme font-bold text-md 
							line-clamp-2 overflow-hidden text-ellipsis'
						>{stream.title}</h3>
						<div className="flex justify-between">
							<p className="w-full flex items-center gap-1 text-sm">
								<Users size={14} className="w-4" />
								{formatNumViewers(stream.num_viewers)}
							</p>
							<p className="text-sm whitespace-nowrap">
								3 days ago
							</p>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default SmallStreamCard;