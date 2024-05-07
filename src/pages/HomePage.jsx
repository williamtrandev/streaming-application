import { streamers } from "../constants";
import StreamCard from "../components/home/StreamCard";

const HomePage = () => {
	return (
		<div className='w-full mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
			{streamers.map((streamer, index) => (
				<StreamCard
					key={index}
					index={index}
					streamer={streamer}
				/>
			))}

		</div>
	);
}

export default HomePage;