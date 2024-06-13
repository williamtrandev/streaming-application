import { Link } from 'react-router-dom';
import { Radio, Users } from "lucide-react";
import { formatDuration, formatNumViewers, formatTimeDifference } from '../../utils/formatNumber';
const StreamCard = ({
	index,
	stream
}) => {
	return (
		<Link to={`/live/${stream?._id}`}>
			<div className="rounded-2xl border-r-2 border-b-2 border-transparent
			hover:border-purple-600 dark:hover:border-gray-300">
				<div className='bg-white dark:bg-meta-4 rounded-2xl text-theme shadow-md overflow-hidden'>
					<div className="relative">
						<img src={stream?.previewImage?.url} alt="" className="object-contain" />
						{stream.duration == 0 && <div className="bg-red-600 text-white px-1 rounded-md text-sm
								absolute bottom-3 right-3 flex items-center gap-1">
							<Radio size={16} />
							LIVE
						</div>}
						{stream.duration > 0 && <div className="bg-slate-700 text-white px-1 rounded-md text-sm
								absolute bottom-3 right-3 flex items-center gap-1">
							{formatDuration(stream.duration)}
						</div>}
					</div>

					<div className="p-3 h-29">
						<div className="flex items-start gap-2">
							<img src={stream?.user?.profilePicture?.url} alt="" className="rounded-full w-9" />
							<div>
								<h3 className="text-theme font-bold text-md 
								line-clamp-2 overflow-hidden text-ellipsis"
								>
									{stream?.title}
								</h3>
								<div className='font-extralight w-fit text-sm hover:underline'>
									<Link to={`/${stream?.user?.username}`}>{stream?.user?.fullname}</Link>
								</div>
							</div>
						</div>

						<p className="w-full flex justify-end items-center gap-2">
							<Users className="w-4" />
							{formatNumViewers(stream?.numViews)}
						</p>
						<p className="text-end">
							{formatTimeDifference(stream?.dateStream)}
						</p>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default StreamCard;