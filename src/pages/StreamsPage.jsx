import { streamers } from "../constants";
import StreamCard from "../components/home/StreamCard";
const StreamsPage = () => {
	return (
		<div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
			{streamers.map((streamer, index) => (
				<StreamCard
					key={index}
					index={index}
					streamer={streamer}
				/>
			))}
		</div>
	)
}

export default StreamsPage;