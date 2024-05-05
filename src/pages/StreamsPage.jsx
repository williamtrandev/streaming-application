import { games } from "../constants";
import StreamCard from "../components/home/StreamCard";
import SectionWrapper from "../components/commons/SectionWrapper";
const StreamsPage = () => {
	return (
		<SectionWrapper>
			<div className='w-full mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
				{games.map((game, index) => (
					game.streamers && game.streamers.map((streamer, s_index) => (
						<StreamCard
							key={s_index}
							index={s_index}
							streamer={streamer}
						/>
					))
				))}
			</div>
		</SectionWrapper>
	)
}

export default StreamsPage;