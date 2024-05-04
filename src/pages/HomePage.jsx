import GameCard from "../components/home/GameCard";
import { styles } from "../styles";
import SectionWrapper from "../components/commons/SectionWrapper";
import { motion } from "framer-motion";
import { textVariant } from "../utils/motion";
import { games } from "../constants";
import StreamCard from "../components/home/StreamCard";

const HomePage = () => {
	return (
		<SectionWrapper>
			<>
				<motion.div variants={textVariant()}>
					<p className={styles.sectionSubText}>Top Games</p>
				</motion.div>

				<div className='w-full mt-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5'>
					{games.map((game, index) => (
						<GameCard
							key={index}
							index={index}
							game={game}
						/>
					))}
				</div>

				{games.map((game, index) => (
					<>
						<motion.div key={index} variants={textVariant()} className="mt-10">
							<p className={styles.sectionSubText}>{game.name}</p>
						</motion.div>
						<div className='w-full mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
							{game.streamers && game.streamers.map((streamer, s_index) => (
								<StreamCard
									key={s_index}
									index={s_index}
									streamer={streamer}
								/>
							))}
						</div>

					</>
				))}

			</>
		</SectionWrapper>
	);
}

export default HomePage;