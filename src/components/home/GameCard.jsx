import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
const GameCard = ({
	index,
	game
}) => {
	return (
		<motion.div variants={fadeIn("right", "spring", index * 0.5, 0.75)} >
			<div
				className='bg-card p-5 rounded-2xl w-full text-theme flex flex-col justify-center items-center'
			>
				<img src="https://img.nimo.tv/o/game/793A1158BA956F1D1509EFD45EB6C42B_gta_136.png/l0/img.webp" alt=""
					className="w-full"
				/>
				<div className='mt-5'>
					<h3 className='text-theme font-bold text-md'>{game.name}</h3>
				</div>
				<p> {game.num_lives} lives </p>
			</div>
		</motion.div>
	);
};

export default GameCard;