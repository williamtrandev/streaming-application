
import { Link } from 'react-router-dom';
import { Users } from "lucide-react";
const StreamCard = ({
	index,
	streamer
}) => {
	return (
		<Link to={`/live/${streamer.id}`}>
			<div className='bg-card rounded-2xl text-theme'>
				<img src={streamer.preview_image} alt="" className="object-contain" />
				<div className='mt-2 p-5 flex flex-wrap items-center gap-1 space-x-2'>
					<img src={streamer.user.avatar} alt="" className="rounded-full w-[2rem] sm:w-[3rem] md:w-[4rem]" />
					<div>
						<h3 className='text-theme font-bold text-md'>{streamer.title}</h3>
						<p className='font-extralight text-sm'>{streamer.user.name}</p>
					</div>
					<p className="w-full flex justify-end items-center space-x-2">
						<Users className="w-[1rem]" />
						<span>{streamer.num_viewers}</span>
					</p>
				</div>
			</div>
		</Link>
	);
};

export default StreamCard;