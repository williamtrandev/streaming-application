import { streams } from "../../constants";
import StreamCard from "../../components/home/StreamCard";

const HomePage = () => {
	return (
		<div className='w-full mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
			{streams.map((stream, index) => (
				<StreamCard
					key={index}
					index={index}
					stream={stream}
				/>
			))}

		</div>
	);
}

export default HomePage;