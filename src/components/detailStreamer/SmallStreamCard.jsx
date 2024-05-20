import { Link } from 'react-router-dom';
import { Radio, Users } from "lucide-react";
import { formatNumViewers } from '../../utils/formatNumber';
const SmallStreamCard = ({
	index,
	stream
}) => {
	return (
		<Link to={`/live/${stream.id}`}>
			<div className='bg-white dark:bg-meta-4 rounded-2xl text-theme shadow-md overflow-hidden border-2 border-transparent
				hover:border-purple-400 dark:hover:border-purple-800'>
				<div className="relative">
					<img src={stream.preview_image} alt="" className="object-contain" />
					<div className="bg-slate-700 text-white px-1 rounded-md text-sm
						absolute bottom-3 right-3 flex items-center gap-1">
						01:02:03
					</div>
				</div>
				
				<div className='p-3 space-y-2'>
					<h3 className='text-theme font-bold text-md'>{stream.title}</h3>
					
					<p className="w-full flex items-center gap-1 text-sm">
						<Users size={14} className="w-4" />
						{formatNumViewers(stream.num_viewers)}
					</p>
				</div>
			</div>
		</Link>
	);
};

export default SmallStreamCard;