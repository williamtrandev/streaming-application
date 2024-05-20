import { useState } from "react";
import { useParams } from "react-router-dom";
import { streams } from "../constants";
import ProfileHeader from "../components/detailStreamer/ProfileHeader";
import HomeTab from "../components/detailStreamer/HomeTab";
import StreamsTab from "../components/detailStreamer/StreamsTab";
import AboutTab from "../components/detailStreamer/AboutTab";

const StreamerPage = () => {
	const { id } = useParams();
	const [activeTab, setActiveTab] = useState(0);

	const tabData = [
		{ id: 0, label: "Home" },
		{ id: 1, label: "Streams" },
		{ id: 2, label: "About" },
	];

	const fakeStreamer = {
		profile_cover: "https://react-demo.tailadmin.com/assets/cover-01-e8bbef04.png",
		avatar: 'https://avatars.githubusercontent.com/u/102520170?v=4',
		name: "William Tran",
		num_followers: 113315,
		about: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
		Pellentesque posuere fermentum urna, eu condimentum mauris
		tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus
		ultricies. Sed vel aliquet libero. Nunc a augue fermentum,
		pharetra ligula sed, aliquam lacus.`,
	}

	return (
		<div>
			<ProfileHeader streamer={fakeStreamer} />

			<div className="w-full">
				<div className="flex border-b border-gray-200 gap-8">
					{tabData.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`px-4 py-2 font-bold text-xl ${activeTab === tab.id
								? 'border-b-4 border-black-2 text-black-2 dark:border-white dark:text-white'
								: 'border-b-2 border-transparent text-neutral-600 dark:text-neutral-400 hover:border-neutral-600 dark:hover:border-neutral-400'
								}`}
						>
							{tab.label}
						</button>
					))}
				</div>
				<div className="py-4">
					<div
						key={0}
						className={`${activeTab === 0 ? 'block' : 'hidden'}`}
					>
						<HomeTab currentStream={streams[0]} mostLikedStream={streams} mostViewedStream={streams} />
					</div>
					<div
						key={1}
						className={`${activeTab === 1 ? 'block' : 'hidden'}`}
					>
						<StreamsTab streams={streams} />
					</div>
					<div
						key={2}
						className={`${activeTab === 2 ? 'block' : 'hidden'}`}
					>
						<AboutTab about={fakeStreamer.about} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default StreamerPage
